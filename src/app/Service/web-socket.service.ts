import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { WsService } from 'src/ws.service';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: any;
  private notificationSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public notifications$: Observable<any[]> = this.notificationSubject.asObservable();

  constructor(private cookieService: CookieService) {
    const username = this.cookieService.get('profil');
    this.client = Stomp.over(new SockJS('http://localhost:8888/achat/ws'));
    this.client.connect({}, () => {
      this.client.subscribe('/topic/notifications', (message) => {
        const notification: any = JSON.parse(message.body);
        console.log('Received notification:', notification);
        this.notificationSubject.next([...this.notificationSubject.value, notification]);
        if (username.trim() === notification.username.trim()) {
          this.showCustomNotification(notification);
        }
      });
    });
  }

  public sendNotification(notification: { message: string, url: string, createdBy: string, username: string }): void {
    this.client.send('/app/send', {}, JSON.stringify(notification));
  }

  private showCustomNotification(notification: any) {
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification';
    notificationElement.innerHTML = `
      <div class="notification-header">
        <h3 class="notification-title">New notification</h3>
        <i class="fa fa-times notification-close"></i>
      </div>
      <div class="notification-container">
        <div class="notification-media">
          <img src="assets/img.png" alt="" class="notification-user-avatar">
<!--          <i class="fa fa-thumbs-up notification-reaction"></i>-->
        </div>
        <div class="notification-content">
          <p class="notification-text">
            <strong>${notification.username} !!</strong>${notification.message} créée par <strong>${notification.createdBy}</strong>
          </p>
          <span class="notification-timer">a few seconds ago</span>
        </div>
        <span class="notification-status"></span>
      </div>
    `;

    // Close button functionality
    notificationElement.querySelector('.notification-close')?.addEventListener('click', () => {
      notificationElement.remove();
    });

    // Click to navigate functionality
    notificationElement.addEventListener('click', () => {
      window.open(notification.url, '_blank');
    });

    document.body.appendChild(notificationElement);

    setTimeout(() => {
      notificationElement.remove();
    }, 9000);
  }
}