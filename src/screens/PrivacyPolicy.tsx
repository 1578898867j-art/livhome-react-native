import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header } from '../components/kit';
import { colors } from '../theme';

// 隐私政策全文 —— 来源:飞书文档《隐私政策(全英版)》(lark-cli 拉取,原文逐字)
type Blk = { t: 'h1' | 'h2' | 'h3' | 'p'; text: string } | { t: 'pnum'; n: string; text: string };

const POLICY: Blk[] = [
  { t: 'h1', text: 'LIVPHOME App Privacy Policy' },
  { t: 'p', text: 'Explorer (Shenzhen) Intelligent Technology Co., Ltd. and its subsidiaries (hereinafter referred to as “we,” “us,” or “LIVHOME”) are committed to protecting your personal privacy. This Mobile Privacy Policy (hereinafter referred to as this “Policy”) describes how we process personal information and protect information privacy during your use of the following services, products, and related mobile applications (collectively, the “Products”).' },
  { t: 'h2', text: 'Chapter I  Overview' },
  { t: 'p', text: 'When you interact with our Products, please read this Privacy Policy carefully and understand the purposes for which we collect and process your personal data, as well as the security measures we take, including how we use, store, share, and transfer your personal data. Under this Policy, you may exercise your privacy rights, rights of access, and rights of deletion in accordance with our instructions.' },
  { t: 'p', text: 'By agreeing to this Privacy Policy, or by appropriately commencing and continuing to use our Products or services without contacting us through appropriate means to express a contrary intention, you will be deemed to have fully understood and agreed to this Policy. If you have any questions, comments, suggestions, or complaints while reading this Policy, please contact us through the following channels:' },
  { t: 'h3', text: 'Customer Service: +86 18566639910 or yuyong@explorex-ai.com' },
  { t: 'h3', text: 'Privacy Office: yuyong@explorex-ai.com' },
  { t: 'p', text: 'For mobile applications of other brands for which LIVHOME provides support services, our customers determine what personal information is collected through our Products; therefore, this Privacy Policy does not apply to the principles governing the collection or processing of personal information by such other brands. We collect information at the request of our customers, and the processing of such information is limited to providing the services agreed upon between our customers and us. If you are a user of one of our customers and no longer wish to be contacted by the customer using our services, please contact that customer directly and communicate your request.' },
  { t: 'h3', text: 'Definitions' },
  { t: 'p', text: 'Personal Information: Various types of information that, whether used alone or in combination with other information, can identify a natural person or reflect the activities of a specific natural person.' },
  { t: 'p', text: 'Sensitive Personal Data: Includes precise location information. Where the collection of sensitive personal data is involved in providing specific Products or services to you, we will obtain your consent through prominent and clear notice prior to collection.' },
  { t: 'p', text: 'Smart Devices: Non-standard computing devices produced or manufactured by hardware manufacturers that have human-machine interfaces and are capable of transmitting information through wireless networks, including pan-tilt surveillance devices, dash cameras, and similar products.' },
  { t: 'p', text: 'Application: A mobile application developed by LIVHOME that helps end users remotely control smart devices.' },
  { t: 'h2', text: 'Chapter II Information Collection' },
  { t: 'p', text: 'To provide you with our services, we will require you to provide the necessary personal information required for such services. If you do not provide personal information, we may be unable to provide you with our Products or services.' },
  { t: 'h3', text: 'Information You Provide Voluntarily' },
  { t: 'p', text: 'Account or Profile Information: When you register for an account with us, we may collect information such as your name, email address, phone number, username, and login credentials. During your interaction with our Products, we may further collect your nickname, country code, language preference, or time zone information in your account. If you choose to authorize login through a third-party account, we will obtain the account information you share from such third party (such as nickname, region, gender, etc.) and bind it to your LIVHOME account to facilitate quick login. Subject to compliance with applicable laws and regulations, we will use your personal information in accordance with the agreement with the third party and the provisions regarding the sharing of personal information as set forth in its published privacy policy.' },
  { t: 'p', text: 'Feedback: When you use the feedback and suggestion function in our Products, we will collect your email address, mobile phone number, feedback content, and operation logs in order to process your issues and device failures in a timely manner.' },
  { t: 'p', text: 'In addition, depending on different application products and services, LIVHOME will collect corresponding and necessary personal information in order to provide you with Products and services. In general, we need to collect the product serial number and product verification code. Such information constitutes unique and fundamental product information and is necessary for product binding and for further providing you with remote access services.' },
  { t: 'h3', text: 'Information Collected Automatically' },
  { t: 'p', text: 'Device Information: When you interact with our Products, we automatically collect device information such as the device’s MAC address, IP address, wireless connection information, operating system type and version, application version number, push notification identifiers, log files, and mobile network information.' },
  { t: 'p', text: 'Usage Information: During your interaction with our websites and services, we automatically collect usage information related to access, clicks, downloads, sending/receiving messages, and other means of using our websites and services.' },
  { t: 'p', text: 'Log Information: When you use our Application, system logs and exception logs may be uploaded, including your IP address, language, operating system version, date or time of access, and similar information.' },
  { t: 'p', text: 'Please note that device information and service log information, when considered independently, cannot identify a specific natural person. However, if we combine such non-personal information with other information to identify a specific natural person, or combine it with personal information, then during the period of such combined use, such non-personal information will be treated as personal information. Unless authorized by you or otherwise provided by laws and regulations, we will anonymize and de-identify such information.' },
  { t: 'p', text: 'Location Information: When you enable the location function of your mobile device through system authorization and use location-based services, we will collect and use your location information to enable you to use the LIVHOME Application for network configuration with smart devices. When you enable the message reminder function, we will collect video screenshots captured by the camera and push such screenshots to you as reminder message content. You may disable this function through account settings.' },
  { t: 'p', text: 'Audio Recording Information: When you use functions such as remote intercom, we will collect the audio content you submit as necessary in order to provide such functions. You may refuse our collection by disabling microphone permission in system settings, but this will prevent you from using such functions.' },
  { t: 'p', text: 'Camera Information: When you use the QR code scanning function through our Application, camera permission is required. You may refuse our collection by disabling camera permission in system settings, but this will prevent you from using such function.' },
  { t: 'p', text: 'Storage Information: When you save images from the Application to your mobile phone photo album through our Application, the Application requires read and write access to your storage card. You may refuse our collection by disabling the Application’s access to the storage card in system settings, but this will prevent you from using such function.' },
  { t: 'p', text: 'Sharing Information: When you use related device or video-sharing functions of LIVHOME, you may need to submit relevant information such as the nickname of the related person and your relationship with such person; if you refuse to provide such information, you will be unable to use the relevant functions. Please note that sharing or similar functions will make the corresponding personal information public within the scope designated by you. You must carefully determine whether to use such functions and bear the relevant consequences yourself.' },
  { t: 'p', text: 'Device MAC Address: When you use our Products for Wi-Fi network configuration, the Application will request access to the device MAC address information. If you refuse to provide such information, the normal network configuration of the Product may be affected.' },
  { t: 'p', text: 'Application Installation List: When you open the Application, we collect information as to whether applications such as Google or Apple are installed on the current system, in order to determine whether to display the corresponding login options on the login page.' },
  { t: 'h3', text: 'Information About Smart Devices' },
  { t: 'p', text: 'Basic Information of Smart Devices: When you use smart devices connected to our Products or services, we may collect basic information regarding the smart devices, such as device name, device ID, online status, activation time, firmware version, and upgrade information.' },
  { t: 'p', text: 'Information Reported by Smart Devices: Depending on the smart devices you choose to connect to our Products or services, we may collect information reported by your smart devices, such as alarm messages triggered by monitoring devices.' },
  { t: 'h2', text: 'Chapter III Rights Relating to Personal Information' },
  { t: 'h3', text: 'Access to or Correction of Personal Information' },
  { t: 'p', text: 'You have the right to access your personal information, except where otherwise provided by laws and regulations. If you wish to exercise your right of access to data, you may do so in the following ways:' },
  { t: 'p', text: 'Your Account Information: In the LIVHOME Application client, you may enter the personal information and account security page through “Profile” on the main interface to view and update registered information such as nickname, avatar, and email address.' },
  { t: 'p', text: 'Personal information that you cannot access or correct: In addition to the above information, we are unable to provide you with access to and correction services for certain personal information. Such information mainly includes device information collected about you in order to improve your user experience and ensure transaction security, as well as personal information necessary to ensure the normal operation of the business functions you choose. We will use the above information within the scope of your authorization. Although you cannot access or correct such information, you may contact us to request deletion or anonymization.' },
  { t: 'h3', text: 'Deletion of Personal Information' },
  { t: 'p', text: 'You may directly clear or delete information on our Products and/or service pages, including account registration information, through the following path: Home Page – “Profile” – “Personal Account” – “Delete Account”.' },
  { t: 'p', text: 'Under the following circumstances, you may request that we delete other personal information:' },
  { t: 'p', text: 'If our processing of personal information violates laws and regulations;' },
  { t: 'p', text: 'If we collect and use your personal information without obtaining your consent;' },
  { t: 'p', text: 'If our processing of personal information violates our agreement with you;' },
  { t: 'p', text: 'If you have deregistered your service account;' },
  { t: 'p', text: 'If we terminate services and cease operations.' },
  { t: 'p', text: 'If we decide to respond to your deletion request, we will also notify the entities that obtained your personal information from us and require them to delete it in a timely manner, unless otherwise provided by laws and regulations or such entities have obtained your independent authorization.' },
  { t: 'p', text: 'After you delete information from our services, we may not immediately delete the corresponding information from backup systems, but we will delete such information when the backups are updated.' },
  { t: 'h3', text: 'Change of Authorization Scope or Withdrawal of Authorization' },
  { t: 'p', text: 'You may change the scope of your authorization for our continued collection of personal information, or withdraw your authorization, by deleting information, disabling certain services or functions, adjusting privacy settings within the Application client, or managing Application permissions. You may also withdraw all authorization for our continued collection of your personal information by deregistering your account.' },
  { t: 'p', text: 'Please understand that each service requires certain basic personal information in order to be completed. After you withdraw your consent or authorization, we will be unable to continue providing the corresponding services related to such withdrawal, and we will no longer process the relevant personal information. However, your decision to withdraw consent or authorization will not affect any personal information processing carried out previously on the basis of your authorization.' },
  { t: 'h3', text: 'Account Deregistration' },
  { t: 'p', text: 'You may deregister your previously registered account at any time by contacting our customer service or by the following path: Home Page – “Profile” – “Personal Account” – “Delete Account”.' },
  { t: 'p', text: 'Please note that account deregistration is an irreversible operation. After your account is deregistered, we will cease providing Products or services to you, all rights and interests under your account will be cleared, and your personal information will be deleted and cannot be recovered, unless otherwise provided by laws and regulations.' },
  { t: 'h3', text: 'Restriction on Automated Decision-Making by Information Systems' },
  { t: 'p', text: 'At present, we do not make decisions based on non-manual automated decision-making mechanisms, including information systems and algorithms. If we consider it necessary to use such technical means during our operations, we will notify you in a timely manner. If you believe that such decisions have a material impact on your lawful rights and interests, you have the right to request an explanation from us, and we will provide channels for appeal to the extent that this does not infringe trade secrets, the rights and interests of other users, or the public interest.' },
  { t: 'h3', text: 'Obtaining a Copy of Personal Information and Request Response' },
  { t: 'p', text: 'If you are unable to manage your personal information through the methods above, or if you need to obtain a copy of the relevant personal information, or if you have any other claims relating to your personal information rights, you may send an email to [yuyong@explorex-ai.com] or contact us through the other methods listed in this Policy. To ensure security, we may require you to provide a written request or otherwise verify your identity. We will respond to your request within 15 days after receiving your feedback and verifying your identity.' },
  { t: 'p', text: 'In principle, we do not charge fees for your reasonable requests. However, for repeated requests exceeding a reasonable limit, we may charge a certain cost fee at our discretion. We may refuse requests that are unreasonably repetitive, require excessive technical measures (for example, the development of a new system or fundamental changes to existing practices), pose risks to the lawful rights and interests of others, or are highly impractical (for example, involving information stored on backup tapes).' },
  { t: 'p', text: 'In accordance with the Cybersecurity Law, the Information Security Technology—Personal Information Security Specification, and other applicable laws, regulations, and national standards, we may be unable to respond to your request under the following circumstances:' },
  { t: 'p', text: 'Where related to the fulfillment by LIVHOME of obligations prescribed by laws and regulations;' },
  { t: 'p', text: 'Where directly related to national security or national defense security;' },
  { t: 'p', text: 'Where directly related to public safety, public health, or major public interests;' },
  { t: 'p', text: 'Where directly related to criminal investigation, prosecution, trial, or enforcement of judgments;' },
  { t: 'p', text: 'Where there is sufficient evidence that you have subjective malice or are abusing your rights;' },
  { t: 'p', text: 'Where it is necessary to protect your or another person’s life, property, or other major lawful rights and interests, but obtaining your consent is difficult;' },
  { t: 'p', text: 'Where responding to your request would seriously damage your or another individual’s or organization’s lawful rights and interests;' },
  { t: 'p', text: 'Where trade secrets are involved;' },
  { t: 'p', text: 'Other circumstances as provided by applicable laws and regulations.' },
  { t: 'h2', text: 'Chapter IV Security Measures' },
  { t: 'h3', text: 'Protection of Your Personal Information and Security Measures' },
  { t: 'p', text: 'We will make every reasonable effort to protect the personal information we obtain. Personal information will be protected by dedicated departments and personnel.' },
  { t: 'p', text: 'To prevent users’ personal information from being illegally accessed, copied, modified, transmitted, lost, destroyed, processed, or otherwise used under accidental or unauthorized circumstances, we have adopted and will continue to adopt the following measures to protect your personal information:' },
  { t: 'p', text: 'Our network services adopt encryption technologies such as transmission security protocols and provide browsing services through HTTPS and similar means to ensure the security of user data during transmission.' },
  { t: 'p', text: 'We use encryption technologies to encrypt and store users’ personal information and use isolation technologies to isolate users’ personal information.' },
  { t: 'p', text: 'When using personal information, such as for personal information display and personal information correlation calculations, we adopt various data desensitization technologies, including content replacement and encrypted desensitization, to enhance the security of personal information in use.' },
  { t: 'p', text: 'We have established strict data use and access systems and adopted strict access right controls and multi-factor identity authentication technologies to protect personal information and prevent unauthorized use of data. We allow access to personal information only by authorized personnel and require them to fulfill corresponding confidentiality obligations.' },
  { t: 'p', text: 'We adopt specialized data and technical security audits and have implemented multiple measures such as log audits and behavioral audits.' },
  { t: 'p', text: 'Other security measures adopted to protect personal information:' },
  { t: 'p', text: 'We manage and regulate the storage and use of personal information by establishing data classification and grading systems, data security management standards, and data security development standards.' },
  { t: 'p', text: 'We have established an information protection department, an information security emergency response organization, and a personal information protection officer to promote and safeguard personal information security.' },
  { t: 'p', text: 'We strengthen security awareness. We also organize security and privacy protection training courses to enhance employees’ awareness of the importance of protecting personal information.' },
  { t: 'p', text: 'Special Reminder Regarding Personal Biometric Information:' },
  { t: 'p', text: 'Unless otherwise indicated, identification and authentication based on personal biometric information are carried out only on your local device, and we do not return such information to the server; that is, LIVHOME receives only the verification results and does not collect your biometric information.' },
  { t: 'p', text: 'Where it is necessary to collect biometric information under certain business functions (such as value-added facial recognition services), we will endeavor to ensure security through measures such as storing only summary information and AES encryption.' },
  { t: 'p', text: 'Although we have taken the above reasonable and effective measures and complied with the standards required by relevant laws and regulations, due to the openness of network environments, we cannot guarantee the security of your personal information when transmitted through insecure channels. Therefore, we strongly recommend that you take proactive measures to ensure the security of personal information, such as setting complex passwords, changing account passwords regularly, refraining from disclosing account passwords and other personal information to others, and using information sharing or similar functions with caution. In addition, you should understand that where your information is disclosed due to your own actions (such as sharing), LIVHOME shall bear only limited legal liability in accordance with an effective judicial judgment.' },
  { t: 'p', text: 'There are always various risks of information leakage in network environments. Where your information is exposed to leakage risks due to accidents, force majeure, or other circumstances, we will endeavor to control the situation and promptly inform you of the cause of the incident, the security measures we have taken, the security measures you may proactively take, and other relevant information.' },
  { t: 'p', text: 'In the event of a personal information security incident, we will inform you in a timely manner in accordance with the requirements of laws and regulations of: the basic circumstances and possible impact of the security incident, the measures we have taken or will take, recommendations for you to prevent and mitigate risks independently, and remedial measures available to you. At the same time, we will promptly notify you of information relating to the incident by email, letter, telephone, push notification, or other means. Where it is difficult to notify each personal information subject individually, we will issue announcements in a reasonable and effective manner. Where the incident involves children’s personal information, we will notify the children and their guardians in accordance with the law. At the same time, we will report the relevant incident to the competent authorities as required by laws and regulations.' },
  { t: 'h3', text: 'Information Retention Period' },
  { t: 'p', text: 'The personal information of users that we collect is stored in Singapore. LIVHOME will not transfer your personal information overseas unless required for the implementation of regulations or unless your explicit consent has been obtained.' },
  { t: 'p', text: 'During your use of LIVHOME Products or services, we will process your personal information for the shortest period necessary to achieve the purposes described in this Policy, unless a longer retention period is required by specific laws. We will determine the appropriate retention period based on the quantity, nature, and sensitivity of the personal information. After the retention period expires, we will destroy your personal information. If destruction is not possible for technical reasons, we will take appropriate measures to prevent further use of your personal information.' },
  { t: 'h3', text: 'IaaS Services' },
  { t: 'p', text: 'Our services are built on Alibaba Cloud Infrastructure as a Service (IaaS).' },
  { t: 'h2', text: 'Chapter V Protection of Minors’ Personal Information' },
  { t: 'p', text: 'LIVHOME attaches great importance to the protection of minors’ personal information. We do not identify age as a prerequisite when providing Products or services to users; however, the nature of our Products and/or services requires that you be an adult with full civil capacity. If you are a minor under the age of 18, we require that your parents or other guardians carefully read this Privacy Policy and that you use our services or provide information to us only after obtaining their consent. If you collect or submit minors’ personal information through our Products and/or services for the purpose of interacting with children, please ensure that you have obtained prior authorization and consent from their legal guardians.' },
  { t: 'p', text: 'Where minors’ personal information is collected with the consent of parents or legal guardians, we will use or publicly disclose such information only where permitted by law, expressly consented to by parents or legal guardians, or necessary for the protection of minors.' },
  { t: 'p', text: 'If a parent or legal guardian has reason to believe that a minor has submitted personal information to us without prior consent, or if there are any questions regarding our protection of minors’ personal information, please contact us through the methods listed in this Policy.' },
  { t: 'h2', text: 'Chapter VI Statement on Policy Changes' },
  { t: 'p', text: 'We may update this Policy at least once a year to reflect changes in information practices. If we make any material changes, we will notify you before such changes take effect by email (sent to the email address specified in your account) or by posting a notice on this website. We recommend that you review this page periodically for the latest information regarding privacy practices.' },
  { t: 'h2', text: 'Chapter VII Contact Us' },
  { t: 'p', text: 'If you have any questions regarding our practices or this Policy, please contact us through the following means:' },
  { t: 'p', text: 'Explorer (Shenzhen) Intelligent Technology Co., Ltd.' },
  { t: 'p', text: 'Mailing Address: Room 1506, Block A, Qianhai Maple Leaf Financial Center, No. 175 Neihuan Road, Nantou Subdistrict, Nanshan District, Shenzhen, China' },
  { t: 'h3', text: 'Email: yuyong@explorex-ai.com' },
  { t: 'p', text: 'Under normal circumstances, we will reply within fifteen days.' },
  { t: 'p', text: 'If you are dissatisfied with our response, especially where our processing of personal information has infringed upon your lawful rights and interests, you may also file a complaint or report with regulatory authorities such as the cyberspace administration, telecommunications authorities, public security authorities, or market regulation authorities.' },
];

export default function PrivacyPolicy({ navigation }: AppScreenProps) {
  return (
    <Screen contentStyle={{ paddingBottom: 54 }}>
      <Header title="Privacy Policy" onBack={() => navigation.goBack()} />
      <View style={st.body}>
        {POLICY.map((b, i) => {
          if (b.t === 'h1') return <Text key={i} style={st.h1}>{b.text}</Text>;
          if (b.t === 'h2') return <Text key={i} style={st.h2}>{b.text}</Text>;
          if (b.t === 'h3') return <Text key={i} style={st.h3}>{b.text}</Text>;
          if (b.t === 'pnum')
            return (
              <Text key={i} style={st.p}>
                <Text style={st.pNum}>{b.n}  </Text>
                {b.text}
              </Text>
            );
          return <Text key={i} style={st.p}>{b.text}</Text>;
        })}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  body: { paddingHorizontal: 22, paddingTop: 6 },
  h1: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, color: colors.textPrimary, marginTop: 10, marginBottom: 6 },
  h2: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginTop: 22, marginBottom: 4 },
  h3: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginTop: 14, marginBottom: 2 },
  p: { fontSize: 14, fontWeight: '400', lineHeight: 22, color: colors.textSecondary, marginTop: 8 },
  pNum: { fontWeight: '700', color: colors.textPrimary },
});
