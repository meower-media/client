export function requestPermission() {
    let notificationRequest = Notification.requestPermission();
}

export function newNotification(body, icon, title) {
    const options = {
        body: body,
        icon: icon
    };
    const notification = new Notification(title, options);
    return;
}