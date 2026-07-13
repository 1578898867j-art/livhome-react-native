import type { AppScreenProps } from '../navigation/types';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Header } from '../components/kit';
import { colors } from '../theme';

// 服务协议全文 —— 来源:飞书文档《服务协议(全英版)》(lark-cli 拉取,原文逐字)
type Blk = { t: 'h1' | 'h2' | 'h3' | 'p'; text: string } | { t: 'pnum'; n: string; text: string };

const AGREEMENT: Blk[] = [
  { t: 'h1', text: 'Terms of Service' },
  { t: 'p', text: 'Please read and fully understand all rights and obligations set forth in these Terms of Service (hereinafter referred to as this “Agreement”). Please ensure that you accept the terms of this Agreement; otherwise, you shall have no right to download, install, or use the “LIVHOME” software and related services. Once you install, copy, download, access, or otherwise use this software product, you shall be deemed to have accepted this Agreement and agreed to be bound by its terms. If you do not agree to this Agreement, please do not install, copy, or use this Application.' },
  { t: 'p', text: 'This Agreement is a legal agreement entered into between the user and Explorex (Shenzhen) Intelligent Technology Co., Ltd. (hereinafter referred to as the “Company”) regarding the user’s download, installation, use, and copying of the LIVHOME application (hereinafter referred to as the “Software”).' },
  { t: 'h2', text: 'Statement of Rights' },
  { t: 'p', text: 'All intellectual property rights in and to the Software, as well as all information content related to the Software, including but not limited to textual expressions and combinations thereof, icons, graphics, images, charts, colors, interface designs, layout frameworks, related data, additional programs, printed materials, and electronic documents, are protected by the Copyright Law of the People’s Republic of China, international copyright treaties, and other relevant laws and regulations concerning intellectual property rights, and all such rights shall belong to the Company.' },
  { t: 'h2', text: 'Scope of Authorized Use' },
  { t: 'h3', text: '2.1 Download, Installation, and Use' },
  { t: 'p', text: 'The Software is a free application. Users may download, install, and use this Application in unlimited quantities for non-commercial purposes.' },
  { t: 'h3', text: '2.2 Copying, Distribution, and Dissemination' },
  { t: 'p', text: 'Users may copy, distribute, and disseminate this Software product in unlimited quantities for non-commercial purposes, provided that each copy, distribution, and dissemination is complete and accurate, including all software, electronic documents, copyrights, trademarks, and this Agreement related to the Software product.' },
  { t: 'h2', text: 'Restrictions on Rights' },
  { t: 'p', text: '3.1 Prohibition of Reverse Engineering, Decompilation, and Disassembly' },
  { t: 'p', text: 'Users shall not reverse engineer, decompile, or disassemble the Software product, nor shall they modify any resources compiled into the internal program files. Unless such acts are expressly permitted by applicable laws and regulations, users must comply with this provision.' },
  { t: 'h3', text: '3.2 Separation of Components' },
  { t: 'p', text: 'The Software is licensed as a single product. Users may not separate its components for any purpose.' },
  { t: 'h3', text: '3.3 Non-Commercial Use' },
  { t: 'p', text: 'The Software is free software. Users shall not sell, commercially reproduce, or commercially distribute the Software, including but not limited to software sales, pre-installation, bundling, or similar acts.' },
  { t: 'h3', text: '3.4 Reservation of Rights' },
  { t: 'p', text: 'All rights not expressly granted under this Agreement are reserved by the Company. If users wish to exercise any other rights, they must obtain the Company’s prior written consent.' },
  { t: 'h2', text: 'User Instructions' },
  { t: 'pnum', n: '4.1', text: 'The Software provides services including user registration, login, device addition, preview, playback, intercom, alarm push notifications, and other related functions. The Company reserves the right to adjust the service content and service methods from time to time. If you do not accept the adjusted service content or service methods, please discontinue use of the Software.' },
  { t: 'pnum', n: '4.2', text: 'The Software is only applicable to Android and iOS operating systems. If the user no longer wishes to use the Software after installation for any reason, the user may uninstall the Software at any time.' },
  { t: 'pnum', n: '4.3', text: 'Any network usage charges or data traffic fees incurred through the use of the Software shall be borne by the user and paid directly to the relevant network service provider.' },
  { t: 'pnum', n: '4.4', text: 'The Software is supported by the Company in terms of product and technical support. Users shall promptly upgrade the Software to the latest version. After a new version is released, older versions will no longer be maintained. The Company reserves the right to decide whether to cease or continue support and maintenance for any specific version.' },
  { t: 'pnum', n: '4.5', text: 'The Company has the right to provide users with modified or upgraded versions of the Software.' },
  { t: 'pnum', n: '4.6', text: 'The user hereby agrees that, in order to improve user experience, the Company may include within the Software other related products of the Company for the user’s optional download and installation.' },
  { t: 'pnum', n: '4.7', text: 'The Software does not contain any malicious code intended to damage the user’s operating system data or obtain the user’s private information, nor does it contain any function code intended to track or monitor the user’s operating system, and it will not disclose the user’s personal private information contained in other software, documents, or similar materials.' },
  { t: 'pnum', n: '4.8', text: 'Users shall use the Software lawfully, in compliance with applicable regulations and in accordance with this Agreement. Users shall not engage in, including but not limited to, the following acts:' },
  { t: 'p', text: '4.8.1 Deleting or altering any electronic rights management information contained in the Software;' },
  { t: 'p', text: '4.8.2 Intentionally circumventing or destroying technical measures adopted by the copyright owner for the protection of the Software’s copyright;' },
  { t: 'h3', text: '4.8.3 Using the Software to mislead or deceive others;' },
  { t: 'p', text: '4.8.4 Disrupting the normal operation of the Software system or website, or intentionally disseminating computer viruses or other destructive programs;' },
  { t: 'p', text: '4.8.5 Any other act that endangers the security of computer information networks.' },
  { t: 'pnum', n: '4.9', text: 'With respect to software products downloaded from websites other than those designated by the Company, or obtained from media not distributed by the Company, the Company does not guarantee their security. Use of such software may result in unforeseeable risks. Users are advised to download, install, and use such software with caution. The Company shall not bear any legal liability arising therefrom.' },
  { t: 'pnum', n: '4.10', text: 'Any pictures, videos, applications, or other materials uploaded, posted, transmitted, shared, or downloaded by users through the Software, whether public or private, shall be the sole responsibility of the user. Users shall bear full responsibility for all of their acts conducted through the Software.' },
  { t: 'h3', text: '4.11 Privacy Protection' },
  { t: 'pnum', n: '4.11.1', text: 'The Company has established strict rules for the handling of user-uploaded information and security protection measures to ensure that user information is not collected beyond the stated purposes and scope, to safeguard the security of user-uploaded information, and to prevent misuse. The Company undertakes not to disclose or provide users’ registration information to any third party, except in the following circumstances:' },
  { t: 'p', text: '(1) where required by relevant laws and regulations or the Company’s legal service procedures;' },
  { t: 'p', text: '(2) where necessary in emergency circumstances to protect the rights and interests of users and the public;' },
  { t: 'p', text: '(3) where other circumstances require the disclosure, editing, or publication of personal information in accordance with law.' },
  { t: 'pnum', n: '4.11.2', text: 'To help users better use this product, upon the first launch of the system, necessary image resource packages will be automatically downloaded. This operation may consume a small amount of data traffic, and users are advised to perform it in a Wi-Fi environment.' },
  { t: 'h2', text: 'Liability and Limitation of Liability' },
  { t: 'pnum', n: '5.1', text: 'The Software has undergone detailed testing; however, the Company does not guarantee that it is fully compatible with all software and hardware systems, nor does it guarantee that it is entirely free of errors. In the event of incompatibility or software errors, users may call the technical support hotline or visit the Company’s official website to report the issue and obtain technical support. If compatibility issues cannot be resolved, users may uninstall the Software.' },
  { t: 'pnum', n: '5.2', text: 'Users shall bear all risks arising from the use of the Software product. To the maximum extent permitted by applicable law, the Company shall not be liable for any damages or risks arising from the use of or inability to use the Software, including but not limited to direct or indirect personal injury, loss of commercial profits, business interruption, loss of business information, or any other economic loss.' },
  { t: 'pnum', n: '5.3', text: 'The Company does not warrant that the Software will meet the user’s requirements or expectations, that it will be free from interruption or malicious attacks, or that the service content will be timely, secure, reliable, or error-free.' },
  { t: 'pnum', n: '5.4', text: 'Where, due to the user’s own conduct (such as recording, posting, transmitting, sharing, or using unlawful content) or other negligent acts, the user’s account or password is lost, information is disclosed, data is lost, or the account is banned or disabled, the user shall bear all corresponding consequences and legal liabilities.' },
  { t: 'pnum', n: '5.5', text: 'The Company shall not be liable for any issues arising from telecommunications system or Internet failures, operating system failures or viruses, information corruption or loss, operating system problems, or any other force majeure events.' },
  { t: 'pnum', n: '5.6', text: 'Where a user violates this Agreement, the Company shall have the right to take measures including but not limited to terminating the user’s authorization to use the Software, suspending the provision of services, restricting use, and pursuing legal liability.' },
  { t: 'h2', text: 'Miscellaneous' },
  { t: 'pnum', n: '6.1', text: 'If any provision of this Agreement is held to be wholly or partially invalid or unenforceable for any reason, or is in violation of any applicable law, such provision shall be deemed severed, but the remaining provisions of this Agreement shall remain valid and binding.' },
  { t: 'pnum', n: '6.2', text: 'The Company reserves the right to amend this Agreement in accordance with changes in relevant laws and regulations, as well as adjustments to the Company’s operating conditions and business strategies. The amended Agreement shall be published on the Company’s official website and released together with the new version of the Software. In the event of any related dispute, the latest version of the Agreement shall prevail. Continued use of the Software by the user shall be deemed acceptance of such amendments.' },
  { t: 'pnum', n: '6.3', text: 'The Company has the right to send users notices, advertisements, and other information by means such as website announcements and email.' },
  { t: 'pnum', n: '6.4', text: 'All notices to users under this Agreement may be delivered by means of webpage announcements, client pop-up notifications, email, text message, or registered mail. All such notices and announcements shall be deemed an integral part of this Agreement and shall be deemed delivered to the recipient on the date of publication.' },
  { t: 'pnum', n: '6.5', text: 'To the maximum extent permitted by law, the Company reserves the right to interpret and amend this Agreement.' },
];

export default function PrivacyAgreement({ navigation }: AppScreenProps) {
  return (
    <Screen contentStyle={{ paddingBottom: 54 }}>
      <Header title="Terms of Service" onBack={() => navigation.goBack()} />
      <View style={st.body}>
        {AGREEMENT.map((b, i) => {
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
