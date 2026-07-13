import type { AppScreenProps } from '../navigation/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header, Eyebrow, Card, Tap } from '../components/kit';
import { Icon } from '../components/Icon';
import { colors } from '../theme';

// 帮助中心 FAQ —— 来源:飞书文档《LIVHOME Help Center FAQ (English)》(lark-cli 拉取,原文逐字)
type QA = { q: string; a: string };
type Cat = { title: string; qas: QA[] };

const FAQ: Cat[] = [
  {
    title: 'I. General App Questions',
    qas: [
      { q: 'How do I log out?', a: 'Go to Personal Center or Account Settings in the LIVHOME App, find the log out option, and follow the on-screen instructions.\\n\\nLogging out will not automatically delete your account, and it will not automatically delete devices added under your account.' },
      { q: 'How do I delete my account?', a: 'Go to Account Settings in the LIVHOME App, find the account deletion option, and follow the on-screen instructions to submit or confirm the deletion.\\n\\nBefore deleting your account, please make sure there are no bound devices under the account. If there are still bound devices, you need to unbind all devices before deleting the account.\\n\\nDeleting your account may affect your ability to continue using added devices, message records, service records, and other content. Please read the on-screen instructions carefully before proceeding.' },
      { q: 'Why does LIVHOME need camera, microphone, storage, and other permissions?', a: 'These permissions are triggered when you use the corresponding features:\\n\\nMicrophone permission: Used for two-way talk.\\n\\nStorage or photo album permission: Used to save screenshots, recordings, and other content.\\n\\nNotification permission: Used to receive device alerts and system reminders.\\n\\nBluetooth and location-related permissions: Used to search for devices and complete device adding.\\n\\nYou can manage LIVHOME permissions at any time in your phone system settings. Some features may not work properly after certain permissions are disabled.' },
      { q: 'What AI smart services does LIVHOME include?', a: 'In the current version, LIVHOME AI smart services are mainly used to help users get support faster, such as the AI assistant, recommended common questions, and feedback assistance.\\n\\nYou can think of it as an in-app help entry: when you encounter issues such as adding a device, network connection, device offline status, message notifications, or playback, it will try to provide troubleshooting suggestions based on your question.' },
      { q: 'What can the AI assistant help me with?', a: 'The AI assistant can help you understand feature entries, troubleshoot common issues, and suggest next steps.\\n\\nFor example:' },
      { q: 'What should I do if the device cannot connect?', a: '' },
      { q: 'What should I do if the App cannot find the device?', a: '' },
      { q: 'What should I do if the camera is offline?', a: '' },
      { q: 'What should I do if I cannot receive notifications?', a: '' },
      { q: 'What should I do if I cannot view playback?', a: 'If the issue requires manual support, we recommend submitting detailed information through the feedback entry or customer support email.' },
      { q: 'Will the AI assistant replace customer support?', a: 'No. The AI assistant is mainly used to provide instant basic help and troubleshooting suggestions.\\n\\nIf you encounter issues that require manual confirmation, such as account issues, device ownership, device abnormalities, after-sales service, or privacy requests, please contact LIVHOME customer support.' },
      { q: 'What information should I provide when using the AI assistant?', a: 'To help locate the issue faster, you can describe:\\n\\nDevice name or device model.\\n\\nThe step where you are stuck, such as adding a device, live view, notifications, or playback.\\n\\nWhether there is an error message on the App page.\\n\\nWhether the device indicator light or voice prompt has changed.\\n\\nWhether your phone system is iOS or Android.\\n\\nWe do not recommend providing sensitive information such as passwords, verification codes, or bank card information in the conversation.' },
    ],
  },
  {
    title: 'II. General Device Questions',
    qas: [
      { q: 'What should I prepare before adding a device?', a: 'Before adding a device, please make sure:\\n\\nThe device is powered on and in the waiting-to-add state.\\n\\nBluetooth is enabled on your phone.\\n\\nYour phone is connected to an available Wi-Fi network.\\n\\nThe device has been reset to pairing mode.\\n\\nYour phone and the device are as close to the router as possible.\\n\\nThe App has the required permissions enabled, such as Bluetooth and location.\\n\\nThe Wi-Fi password is correct.\\n\\nIf this is not the first time the device is being added, we recommend checking whether the device is still under another account. If necessary, delete the device from the original account first, or reset it as prompted before adding it again.' },
      { q: 'How do I add a device?', a: 'Open the LIVHOME App, go to the Add Device page, select the device you want to add, and follow the on-screen instructions.\\n\\nDifferent devices may support different adding methods. Please refer to the adding process shown in the App for the current device.' },
      { q: 'Why can\'t the App find nearby devices?', a: 'Please check the following:\\n\\nMake sure Bluetooth is enabled on your phone.\\n\\nMake sure the App has obtained Bluetooth and nearby device permissions.\\n\\nMake sure the device is powered on and in the addable state.\\n\\nMove your phone closer to the device and search again.\\n\\nIf the device has already been added to another account, it may not be found as a new device.\\n\\nIf the device still cannot be found, you can return to the Add Device page, select the corresponding device model, and add it manually as prompted.' },
      { q: 'Why did adding the device fail?', a: 'Adding may fail for the following reasons:\\n\\nThe Wi-Fi password is incorrect.\\n\\nThe current network is unstable, or the device is too far from the router.\\n\\nThe device has not entered the waiting-to-add state.\\n\\nWhen adding manually, the device was not reset as prompted.\\n\\nThe device has already been added to another account.\\n\\nThe page may prompt you to search for the device again, or switch to another adding method and try again. You can also return to the Add Device page and follow the instructions again.' },
      { q: 'What should I do if the device has already been added to another account?', a: 'If the device has already been added to another account, the current account may not be able to add it directly.\\n\\nYou can try:\\n\\nAsk the original account user to delete the device in the App.\\n\\nIf the device belongs to you, reset it according to the device instructions and add it again.\\n\\nIf you are not sure which account the device is under, contact customer support for assistance.' },
      { q: 'Do I need to add the device again after changing phones?', a: 'If you log in with the same LIVHOME account, the new phone can usually see the devices already added under that account. You do not need to add them again.\\n\\nIf you log in with a new account, you need to add the device again.' },
    ],
  },
  {
    title: 'III. Xiaohuangren Camera',
    qas: [
      { q: 'What adding methods does the Xiaohuangren Camera support?', a: 'The Xiaohuangren Camera currently has 3 adding paths:\\n\\nBluetooth search binding: The App automatically searches for nearby cameras that can be added. After selecting the device, enter the Wi-Fi information and continue adding it.\\n\\nManual binding - Bluetooth setup: Manually select the device model, enter the Wi-Fi information, and complete adding.\\n\\nManual binding - QR code setup: Manually select the device model, reset the device as prompted, enter the Wi-Fi information to generate a QR code, and let the camera scan the QR code to complete adding.\\n\\nIf you are not sure which method to choose, we recommend using Bluetooth search binding first. If the App cannot find the device, you can switch to manual binding. After the device is added successfully, the App will guide you to rename the device and then enter the Device Details page.' },
      { q: 'Why does QR code scanning fail?', a: 'Please check:\\n\\nWhether the phone screen brightness is too low.\\n\\nWhether the camera lens is too close to or too far from the phone screen.\\n\\nPlease check whether the device is in pairing mode.\\n\\nWe recommend increasing the phone screen brightness, facing the QR code directly toward the camera lens, and keeping an appropriate distance.' },
      { q: 'Does the Xiaohuangren Camera support 5GHz Wi-Fi?', a: 'No. The Xiaohuangren Camera only supports 2.4GHz Wi-Fi and does not support 5GHz Wi-Fi. If it is connected to a 5GHz network, the device will not be able to complete binding.\\n\\nIf your router combines 2.4GHz and 5GHz under the same Wi-Fi name, you can try temporarily turning off 5GHz on the router, or enabling a separate 2.4GHz Wi-Fi network before adding the device again.' },
      { q: 'When do I need to reset the Xiaohuangren Camera?', a: 'You may need to reset the device in the following situations:\\n\\nWhen adding the device through manual binding, the App page prompts you to reset the device first.\\n\\nThe Wi-Fi network or Wi-Fi password has changed.\\n\\nAdding the device failed, and multiple retries still do not work.\\n\\nThe device is no longer under the original account, but it still shows an adding abnormality.\\n\\nThe device has been offline for a long time and cannot recover after a regular restart.\\n\\nAfter reset, the device will return to the waiting-to-add state. Please add the device again in the LIVHOME App.\\n\\nLive View, Pan-Tilt Control, and Two-Way Talk' },
      { q: 'Why can\'t the live view open, or why does it keep loading?', a: 'Please check the following:\\n\\nMake sure the camera is powered on.\\n\\nMake sure the camera is shown as online in the App.\\n\\nCheck whether your phone\'s current network is working properly.\\n\\nMove the camera closer to the router to improve the Wi-Fi signal.\\n\\nExit the live view and enter again.\\n\\nRestart the camera and try again.\\n\\nIf the device goes offline frequently, it may be related to router signal, network stability, or device power supply.' },
      { q: 'How do I adjust the camera angle?', a: 'If your device supports pan-tilt control, you can use the direction controls on the live view page to adjust the camera angle.\\n\\nPlease keep the network stable when adjusting. If there is a delay in control, it is usually caused by network fluctuations. You can wait a few seconds and try again.\\n\\nDo not adjust the camera angle directly by hand, as this may damage the device.' },
      { q: 'Why is pan-tilt control not responding?', a: 'Please check:\\n\\nWhether the current device is online.\\n\\nWhether the current account has control permission.\\n\\nWhether the network is stable.\\n\\nWhether the device is performing another operation.\\n\\nAlert Notifications and Message Center' },
      { q: 'What alert reminders does the Xiaohuangren Camera support?', a: 'The Xiaohuangren Camera currently provides basic alert reminders for home monitoring scenarios, such as motion detection, sound detection, trip wire detection, and Electronic Fence. The specific available items are subject to what is shown on the device page in the App.\\n\\nAfter they are enabled, when the camera detects related events, the App will generate records in the Message Center and send reminders according to your notification settings.' },
      { q: 'Why can\'t I receive alert notifications?', a: 'Please check:\\n\\nWhether the corresponding alert switch is enabled in the App.\\n\\nWhether the phone system allows LIVHOME to send notifications.\\n\\nWhether a notification time period or Do Not Disturb period is set.\\n\\nWhether the camera is online.\\n\\nWhether the current detection sensitivity is too low.\\n\\nWhether the phone network is working properly.\\n\\nIf there are message records in the App but no notification pops up on your phone, it is usually related to phone system notification permissions or Do Not Disturb settings.' },
      { q: 'Why are there alert records in the App, but no system notification pops up on my phone?', a: 'Alert events and phone notifications may be judged separately. After the camera detects an event, the event record may still be kept in the App. However, if the notification master switch, alarm notification switch, or notification time period does not meet the conditions, the phone may not show a system notification.\\n\\nYou can go to Notifications or Alert Settings to check the notification switch, notification time period, and related alert switches.' },
      { q: 'Why is motion detection too frequent?', a: 'If you receive motion detection notifications frequently, you can try:\\n\\nLower the motion detection sensitivity.\\n\\nAdjust the camera angle to avoid curtains, tree shadows, strong light changes, and similar areas.\\n\\nSet an alert time period, and enable monitoring only during the time you need it.\\n\\nIf the current version provides an Electronic Fence or area setting entry, you can reduce areas that do not need attention.' },
      { q: 'Why is no motion or sound detected?', a: 'Please check:\\n\\nWhether the corresponding detection switch is enabled.\\n\\nWhether the camera is online.\\n\\nWhether the camera view covers the target area.\\n\\nWhether the detection sensitivity is too low.\\n\\nWhether the current environmental sound or movement range is too small.\\n\\nIf the camera is blocked, the angle is off, or the network is unstable, alert records may also be affected.' },
      { q: 'How do I view historical alert messages?', a: 'Go to the Message Center in the LIVHOME App, and select the corresponding device or message type to view historical alert records.\\n\\nIf the message list is empty, please confirm whether the alert feature is enabled and whether the device stayed online during the corresponding time period.\\n\\nPlayback and Storage' },
      { q: 'Why can\'t I view playback?', a: 'Please check:\\n\\nWhether the camera is online.\\n\\nWhether the SD card has been inserted and recognized by the device.\\n\\nWhether recording is enabled.\\n\\nWhether there are recordings for the selected time period.\\n\\nWhether the SD card is abnormal or has insufficient space.\\n\\nIf the SD card is being used for the first time, it may need to be formatted in the App before use.' },
      { q: 'What should I do if the SD card is abnormal?', a: 'Please try:\\n\\nPower off the device and reinsert the SD card.\\n\\nCheck the SD card status in the App.\\n\\nFormat the SD card as prompted on the page.\\n\\nReplace it with a reliable SD card that meets the device capacity requirements.\\n\\nFormatting will erase existing content on the SD card. Please proceed with caution.\\n\\nDevice Settings' },
      { q: 'Where is the settings entry for the Xiaohuangren Camera?', a: 'After entering the Xiaohuangren Camera page, you can go to the settings page to manage the device.\\n\\nThe settings page mainly includes:\\n\\nDevice Details\\n\\nDevice Settings\\n\\nNotifications\\n\\nAlert Settings\\n\\nElectronic Fence\\n\\nRestart Device\\n\\nDelete Device' },
      { q: 'How do I change the device name?', a: 'Go to the Device Settings page, find the device name, enter a new name, and save it.\\n\\nWe recommend using an easy-to-identify location name, such as "Living Room Camera" or "Front Door Camera".' },
      { q: 'How do I set the Device Time Zone?', a: 'Go to the Device Settings page and find Device Time Zone. You can search for a city or time zone, or select the recommended time zone based on your current location.\\n\\nIf the device time, recording time, or message time is inaccurate, please check whether the Device Time Zone is correct first.' },
      { q: 'What should I do if the image is upside down?', a: 'If the image is upside down after the camera is installed, you can go to the Device Settings page and enable Image Flip 180°.\\n\\nAfter it is enabled, the image will rotate 180°. You can check the preview to confirm whether it matches the actual installation direction.' },
      { q: 'What should I do if the night image is too dark?', a: 'Go to the Device Settings page and find Night Vision. Night Vision supports three modes: Auto, On, and Off:\\n\\nAuto: Automatically switches night vision based on ambient light.\\n\\nOn: Always turns on night vision.\\n\\nOff: Turns off night vision.\\n\\nIf the image is too dark at night, we recommend using Auto or On first.' },
      { q: 'What should I do if the image flickers or has horizontal stripes?', a: 'Go to the Device Settings page and find Anti-Flicker Setting. This setting is used to reduce image flickering or horizontal stripes.\\n\\nCurrently, you can choose 50Hz or 60Hz. In general, you can try 50Hz first. If flickering persists after switching, try 60Hz.' },
      { q: 'How do I adjust the device volume?', a: 'Go to the Device Settings page and find Volume. Volume supports levels 1 to 10.\\n\\nIf the prompt sound or call sound is too low, you can increase the volume. If the sound is too loud, you can lower the volume.' },
      { q: 'What is Smart Tracking?', a: 'After Smart Tracking is enabled, the camera will try to automatically follow moving targets.\\n\\nIf you do not want the camera to rotate automatically, you can turn off Smart Tracking on the Device Settings page.' },
      { q: 'What is Device off Time?', a: 'Device off Time is used to set the camera to turn off during a specified time period. You can set the time and repeat rules on the Device off Time page.\\n\\nIf the time you set overlaps with an existing schedule, the page may show a time conflict prompt. Please adjust the time and save again.' },
      { q: 'What is Idle Time?', a: 'Idle Time is used to set how long the device waits before entering standby after the camera detects no movement or no person in the image. The current options are 5 minutes, 10 minutes, and 15 minutes.\\n\\nIf you want the device to enter standby faster, choose a shorter time. If you want it to stay active longer, choose a longer time.' },
      { q: 'How do I restart the Xiaohuangren Camera?', a: 'Go to the Device Settings page, select Restart Device, and confirm in the confirmation pop-up.\\n\\nThe device may go offline briefly during restart. Please wait until the device comes back online before using live view, playback, or alert features.' },
      { q: 'How do I delete the Xiaohuangren Camera?', a: 'Go to the Device Settings page, select Delete Device, and confirm in the confirmation pop-up.\\n\\nAfter deletion, the device will be removed from the device list under the current account. If you want to continue using it, you need to add the device again.\\n\\nNotifications, Alert Settings, and Electronic Fence' },
      { q: 'What can Notifications do?', a: 'Notifications are used to manage the App\'s notification behavior, mainly including:\\n\\nNotification master switch: Controls whether to receive message notifications.\\n\\nNotification frequency: You can choose real-time, 1 minute, 30 minutes, 1 hour, or a custom interval. Within the set interval, if events are detected multiple times, you will only receive one notification to avoid frequent interruptions.\\n\\nDo Not Disturb time period: Sets a time period during which notifications will not be sent.\\n\\nAlarm notification switch: Controls whether to receive alarm notifications.\\n\\nIf you cannot receive phone notifications, please check the notification master switch, alarm notification switch, notification time period, and whether the phone system allows LIVHOME to send notifications.' },
      { q: 'What can Alert Settings do?', a: 'Alert Settings are used to manage how the camera generates alert events, mainly including:\\n\\nMotion Detection: You can set sensitivity (low / medium / high) and detection area (select the grid areas that need monitoring).\\n\\nSound Detection: You can set sensitivity (low / medium / high).\\n\\nTrip Wire: You can drag both ends of the line segment to set the trip wire position and choose the crossing direction (two-way A↔B / one-way A→B / one-way B→A).\\n\\nAlert reminder: You can set the alarm notification switch, Voice Alarm (system voice / custom voice, up to 3 recordings, each up to 8 seconds), and alert time period.\\n\\nWhether an event is generated mainly depends on the corresponding detection switch and alert time settings. Whether it is pushed to the phone is also affected by notification settings.' },
      { q: 'What is Trip Wire?', a: 'Trip Wire is used to set an alert line. When the camera detects a target crossing this line, an alert event will be generated.\\n\\nIf the page provides a setting entry, you can drag both ends of the line segment to adjust the trip wire position, and save as prompted.' },
      { q: 'What is Electronic Fence?', a: 'Electronic Fence is used to set a monitoring area. Electronic Fence is disabled by default. After it is enabled, the camera will detect the fence edge. When something exceeds the edge, it will remind you and record alert information.\\n\\nIf you only want to focus on a certain area, you can go to the Electronic Fence page to set the monitoring area.' },
      { q: 'How do I set the monitoring area for Electronic Fence?', a: 'After entering the Electronic Fence page, select Detection Area or the monitoring area setting entry. The page will enter area editing mode.\\n\\nWhen editing, if you tap cancel or close, this edit may not be saved. After tapping confirm, the current area will be saved, and the set area will be displayed the next time you enter.' },
      { q: 'Can I set an effective time for Electronic Fence?', a: 'Yes. The Electronic Fence page includes Detection Time Period. You can set Electronic Fence detection to run only during the specified time period.\\n\\nIf you do not want to receive Electronic Fence reminders all day, you can set a detection time period.' },
    ],
  },
  {
    title: 'IV. Contact Customer Support and Feedback',
    qas: [
      { q: 'What information should I provide when contacting LIVHOME customer support?', a: 'To help locate the issue faster, we recommend providing:\\n\\nLIVHOME App version.\\n\\nPhone system and model.\\n\\nDevice name or device model.\\n\\nDevice number or serial number.\\n\\nTime when the issue occurred.\\n\\nApp page screenshot or error message.\\n\\nDevice indicator light, voice prompt, or online status.\\n\\nCurrent network environment, such as home Wi-Fi, company network, or hotel network.' },
      { q: 'What is the LIVHOME customer support email?', a: 'You can contact LIVHOME customer support at:\\n\\nLivhomeTeam@explorex-ai.com\\n\\nWhen submitting an issue, please describe the specific scenario you encountered as clearly as possible, and attach relevant screenshots or error messages.' },
    ],
  },
];

export default function HelpCenter({ navigation }: AppScreenProps) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Screen contentStyle={{ paddingBottom: 40 }}>
      <Header title="Help Center" onBack={() => navigation.goBack()} />
      {FAQ.map((cat, ci) => (
        <View key={ci}>
          <Eyebrow>{cat.title}</Eyebrow>
          <Card style={st.card}>
            {cat.qas.map((qa, qi) => {
              const id = ci + '-' + qi;
              const on = open === id;
              const last = qi === cat.qas.length - 1;
              return (
                <View key={id} style={{ position: 'relative' }}>
                  <Tap style={st.qRow} onPress={() => setOpen(on ? null : id)}>
                    <Text style={[st.qText, on && { color: colors.brand }]}>{qa.q}</Text>
                    <Icon name={on ? 'chevU' : 'chevD'} size={15} color={colors.textTertiary} sw={2} />
                  </Tap>
                  {on && <Text style={st.aText}>{qa.a}</Text>}
                  {!last && <View style={st.rowLine} />}
                </View>
              );
            })}
          </Card>
        </View>
      ))}
    </Screen>
  );
}

const st = StyleSheet.create({
  card: { marginHorizontal: 18 },
  qRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  qText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary, lineHeight: 21 },
  aText: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.textSecondary,
  },
  rowLine: { position: 'absolute', left: 16, right: 16, bottom: 0, height: 1, backgroundColor: colors.border },
});
