"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const AllAssembly = () => {
  const [activeTab, setActiveTab] = useState("2019");
  const { t } = useTranslation();

  const Assembly2015Data = {
    officials: [
      {
        position: t("allAssembly.positions.nationalPresident"),
        name: "श्री कैलाश नारायण सावला",
        address: "5/45 कृष्णपुरा डबरा (ग्वालियर) (म. प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425481606`,
        image: "/executive/1.webp"
      },
      {
        position: t("allAssembly.positions.seniorVicePresident"),
        name: "श्रीमती पुष्पा ददरया",
        address: "3664 मनमोहन नगर, गायत्री मन्दिर के पास, जबलपुर (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9479495800`,
        image: "/executive/2.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री सतीष सुहाने",
        address: "305 तानसेन अपार्टमेन्ट, तानसेन रोड, ग्वालियर (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425482181`,
        image: "/executive/3.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री रमेश सेठ",
        address: "1389, रिफ्यूजी कॉलोनी, सीपरी बाजार, झांसी (उ.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9415030647`,
        image: "/executive/4.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री पुरूशोत्तम पोद्दार",
        address: "पोद्दार ज्वैलर्स, इन्दरगढ़ जिला-दतिया (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9893877819`,
        image: "/executive/5.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री कैलाश नारायण सुहाने",
        address: "डी-72, विश्णु हाईटेक सिटी बाबडि़याकला भोपाल (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425011411`,
        image: "/executive/6.webp"
      },
      {
        position: t("allAssembly.positions.generalSecretary"),
        name: "श्री सतीष महतेले",
        address: "एच-10, चेतकपुरी, ग्वालियर (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425338638`,
        image: "/executive/7.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री राधेश्याम सेठ",
        address: "माँ भगवती कृपा, मोटे गणेश गली, खासगी बाजार, ग्वालियर (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425336363`,
        image: "/executive/8.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री मैथिलीशरण सेठ",
        address: "642 कमलसिंह कॉलोनी, खाती बाबा,झांसी (उ.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 09415401600`,
        image: "/executive/9.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री अशोक नगरिया",
        address: "बी-601, षिवदर्षन हाउसिंग सोसायटी, नवी मुम्बई (महा.)",
        mobile: `${t("allAssembly.contact.mobile")} 9320341782`,
        image: "/executive/10.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री जगदीश प्रसाद गेड़ा",
        address: "राममन्दिर के सामने, फालका बाजार, ग्वालियर (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9203305960`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री संजय ब्रजपुरिया",
        address: "910 तुलसी नगर, उरई, जिला-जालौन (उ.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9829743382`,
        image: "/executive/12.webp"
      },
      {
        position: t("allAssembly.positions.coordinator"),
        name: "श्री राकेश लहारिया",
        address: "लहारिया भवन, लोहिया बाजार,ग्वालियर (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9770252486`,
        image: "/executive/13.webp"
      },
      {
        position: t("allAssembly.positions.publicityMinister"),
        name: "श्री मोहन कनकने",
        address: "थोराट की गोठ, लोहिया बाजार,ग्वालियर (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425109958`,
        image: "/executive/14.webp"
      },
      {
        position: t("allAssembly.positions.propertyDevelopmentCoordinator"),
        name: "श्री मनोज चौधरी",
        address: "बड़ा बाजार, पिछोर, जिला-शिवपुरी (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425763325`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.coordinator"),
        name: "श्री प्रदीप नीखरा",
        address: "15 अमलतास फेस-2, चूना भट्टी भोपाल (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425011461`,
        image: "/executive/15.webp"
      }
    ],
    nominatedOfficials: [
      {
        position: t("allAssembly.positions.manager"),
        name: "श्री संजय बिष्वारी",
        address: "राजाबेटी भवन 128/240 एच-1 ब्लॉक किदवई नगर कानपुर (उ.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9415591278`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री ओमप्रकाश सेठ (दाऊ)",
        address: "चित्रकूट भवनतेजेन्द्रनाथ की गली, दाल बाजार, ग्वालियर (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425116791`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.executiveChairman"),
        name: "श्री भोगीलाल बिलैया",
        address: "न्यू कॉलोनी, करैरा जिला-शिवपुरी (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9406589899`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.centralMinister"),
        name: "श्री भरत सेठ",
        address: "सनराइज़ होटल ए 2072 . सिविल लाइन ए झाँसी (उ. प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9415123515`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.jointMinister"),
        name: "श्री कमल तपा",
        address: "आई-25 हरीषंकरपुरम ग्वालियर (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 7697219900`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.jointMinister"),
        name: "श्री राकेश रावत",
        address: "2 / 403 विवेक खंड ए गोमती नगर ए",
        mobile: `${t("allAssembly.contact.mobile")} 9415312458`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.jointMinister"),
        name: "श्री शिवशंकर सेठ",
        address: "सेठ भवन\" सिद्धेश्वर मंदिर के सामने ए सिद्धेश्वर कॉलोनी ए शिवपुरी (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425136790`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.jointMinister"),
        name: "श्री राकेश कनकने",
        address: "कालेज चौराहा, पिछोर, जिला-शिवपुरी (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425490357`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.developmentMinister"),
        name: "श्री अशोक सोनी",
        address: "19 राजदेव कॉलोनी, नया कबाड़खाना भोपाल (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9893052500`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.developmentMinister"),
        name: "श्री सुदामाप्रसाद सिजरिया",
        address: "मिहोना, जिला-भिण्ड (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9926661905`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.developmentMinister"),
        name: "श्री राजकुमार लोहिया",
        address: "पूजा ज्वेलर्स ए सराफा बाजार ए इतवारीए नागपुर (महा.)",
        mobile: `${t("allAssembly.contact.mobile")} 9422146164`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.developmentMinister"),
        name: "श्री सतीष सुहाने",
        address: "44 गुरू घासीदास वार्ड, कुसुमबिला के सामने, रिंग रोड, रायपुर (छ.ग.)",
        mobile: `${t("allAssembly.contact.mobile")} 982616502`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.organisationMinister"),
        name: "श्री प्रमोद गेड़ा",
        address: "एफ-91, हरीशंकरपुरम, प्रमिला पैलेस के सामने, ग्वालियर (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9301121008`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.organisationMinister"),
        name: "श्री प्रेमनारायण लहारिया",
        address: "432 / 9 बीए साकेत नगर ए भोपाल(म. प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9893026732`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.organisationMinister"),
        name: "श्री सुरेश बंधु",
        address: "बीज भण्डार रोड, करैरा, जिला-शिवपुरी (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425765588`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.organisationMinister"),
        name: "श्री नितिन सरावगी",
        address: "झांसी (उ.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9415031136`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.organisationMinister"),
        name: "श्री सतीश सेठ",
        address: "बी -89 ए एकता नगर ए एम. आर. 4रोड ए जबलपुर (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9407252501`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.assistantMinister"),
        name: "श्री नरेन्द्र खरया",
        address: "एचआईजी-1,-443 हाउसिंग बोर्ड, दुर्ग (छ.ग.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425234740`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.assistantMinister"),
        name: "श्री राजेश नीखरा",
        address: "इन्दरगढ़, जिला-दतिया (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9425234740`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.assistantMinister"),
        name: "श्री राकेश कनकने",
        address: "ई-10, एस/आर. हरी शंकरपुरम, ग्वालियर (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9893051569`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.assistantMinister"),
        name: "श्री विनोद नीखरा",
        address: "द्वारा- जमुना प्रसाद नीखराए डी-185ए अम्बिका नगरए वेलापार्कए ओढवए अहमदाबाद (गुजरात)",
        mobile: `${t("allAssembly.contact.mobile")} 9998071666`,
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.assistantMinister"),
        name: "श्री रामकुमार नीखरा",
        address: "ईडबल्यूएफ 635 सरस्वती नगर, जवाहर चौक, भोपाल (म.प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 9826019279`,
        image: "/executive/img-8.webp"
      }
    ],
    projectOfficials: []
  };

  const Assembly2019Data = {
    officials: [
      {
        position: t("allAssembly.positions.nationalPresident"),
        name: "श्री कृष्ण कुमार कठिल (के के कठिल)",
        address: "",
        mobile: "",
        image: "/executive/16.webp"
      },
      {
        position: t("allAssembly.positions.generalSecretary"),
        name: "श्री आलोक टिकरिया",
        address: "",
        mobile: "",
        image: "/executive/17.webp"
      },
      {
        position: t("allAssembly.positions.treasurer"),
        name: "श्री मोहन कनकने",
        address: "",
        mobile: "",
        image: "/executive/18.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री रमेश सेठ",
        address: "",
        mobile: "",
        image: "/executive/19.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री अशोक नगरिया",
        address: "",
        mobile: "",
        image: "/executive/20.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री अशोक सेठ",
        address: "",
        mobile: "",
        image: "/executive/21.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री नरेश कुचिया",
        address: "",
        mobile: "",
        image: "/executive/22.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री केशव नीखरा",
        address: "",
        mobile: "",
        image: "/executive/23.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री संतोष कुचिया",
        address: "",
        mobile: "",
        image: "/executive/24.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री प्रमोद गेड़ा",
        address: "",
        mobile: "",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री राधेश्याम सेठ",
        address: "",
        mobile: "",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री मनोज चौधरी",
        address: "",
        mobile: "",
        image: "/executive/25.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री मैथिली शरण सेठ",
        address: "",
        mobile: "",
        image: "/executive/26.webp"
      }
    ],
    nominatedOfficials: [],
    projectOfficials: []
  };

  const ExecutiveCentralData = {
    officials: [
      {
        position: t("allAssembly.positions.nationalPresident"),
        name: "श्री राधेश्याम कुमिया",
        address: "J-46 गांधी नगर, ग्वालियर",
        mobile: `${t("allAssembly.contact.mobile")} 09425114006`,
        image: "/executive/img-1.webp"
      },
      {
        position: t("allAssembly.positions.generalSecretary"),
        name: "श्री राजीव साहवे",
        address: "29 भोपाल विखारा वार्ड होशी",
        mobile: `${t("allAssembly.contact.mobile")} 09415073295`,
        image: "/executive/img-2.webp"
      },
      {
        position: t("allAssembly.positions.seniorVicePresident"),
        name: "श्री भोगीलाल बिलैया",
        address: "न्यू कालोनी, करेरा जिला- शिवपुरी",
        mobile: `${t("allAssembly.contact.mobile")} 09406589899`,
        image: "/executive/img-3.webp"
      },
      {
        position: t("allAssembly.positions.publicityMinister"),
        name: "श्री रमेश चन्द्र सरावगी",
        address: "पुराने थाने के सामने ,गोहद जिला -भिंड मोबा",
        mobile: `${t("allAssembly.contact.mobile")} 9893140676`,
        image: "/executive/img-4.webp"
      },
      {
        position: t("allAssembly.positions.managerRajabeti"),
        name: "श्री परमानन्द कटारे",
        address: "74 M.I.G, Wब्लाक केसव नगर जूही, कानपुर मोबा.",
        mobile: `${t("allAssembly.contact.mobile")} 09415044099`,
        image: "/executive/img-5.webp"
      },
      {
        position: t("allAssembly.positions.managerGahoiBhawanChitrakoot"),
        name: "श्री हरीबाबू सेठ",
        address: "जवाहर गंज ,गल्ला मंडी के सामने ,डबरा जिला -ग्वालियर",
        mobile: `${t("allAssembly.contact.mobile")} 09300102240`,
        image: "/executive/img-6.webp"
      },
      {
        position: t("allAssembly.positions.treasurer"),
        name: "उमाशंकर कुचिया",
        address: "15 / 21 ए , सहयोग सदन ,सिविल लाइन, कानपुर (उ. प्र.)",
        mobile: `${t("allAssembly.contact.mobile")} 09839240116`,
        image: "/executive/img-7.webp"
      },
      {
        position: t("allAssembly.positions.auditor"),
        name: "श्री प्रदीप नीखरा",
        address: "भोपाल",
        mobile: "",
        image: "/executive/img-8.webp"
      }
    ],
    nominatedOfficials: [
      {
        position: t("allAssembly.positions.executivePresident"),
        name: "श्री उमाशंकर लहारिया",
        address: "MZ-5, गुल मोहर, ग्रीन गार्डन, सिटी सेंटर, ग्वालियर",
        mobile: `${t("allAssembly.contact.mobile")} 09425150272`,
        image: "/executive/member-1.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्रीराम गोपाल छिरोल्या (डल्लू भैया )",
        address: "13 ,दाता कालोनी ,एअरपोर्ट रोड ,भोपाल",
        mobile: "9993953844",
        image: "/executive/member-2.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्रीमती पुष्पा ददरया",
        address: "1664, मनमोहन नगर, कृषि उपज मंडी के पास जबलपुर",
        mobile: "9479495800",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री बाबू लाल डेंगरे",
        address: "117, जावरा कम्पाउन्ड ,इंदौर",
        mobile: "फोन 0731 -2705182",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री सतीश सुहाने",
        address: "305 ,तानसेन अपार्टमेन्ट ,तानसेन रोड ग्वालियर",
        mobile: "9425482181",
        image: "/executive/member-3.webp"
      },
      {
        position: t("allAssembly.positions.vicePresident"),
        name: "श्री प्रकाश नौगरैया",
        address: "जैन नर्सिंग होम के पास ,सिविल लाइन , झाँसी",
        mobile: "9415030373",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री शशिकांत निगोतिया",
        address: "160 ,गोपाल गंज ,उरई जिला -जालोन (उ.प्र.)",
        mobile: "9336031818",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "डॉ . करुणेश गुप्ता (चपरा )",
        address: "1 / 10074 ,बी गली न. 35 ,द्धितीय तल, वेस्ट गोरख पार्क ,दिल्ली",
        mobile: "9891317151",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री भगवानदास बिलैया",
        address: "242 ,न्यू मिनरल जेससीम बंगला ,भोपाल",
        mobile: "9827049690",
        image: "/executive/member-4.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री अरुण नीखरा",
        address: "बलदेव बाग, जबलपुर",
        mobile: "9425163183",
        image: "/executive/member-5.webp"
      },
      {
        position: t("allAssembly.positions.assistantTreasurer"),
        name: "श्री राकेश लहारिया",
        address: "लोहिया बाज़ार ,ग्वालियर",
        mobile: "09425109949",
        image: "/executive/member-6.webp"
      },
      {
        position: t("allAssembly.positions.centralMinister"),
        name: "श्री राजेंद्र गेंडा",
        address: "मो.परवारण, खोवा मंडी ,गाँधी रोड ,झाँसी",
        mobile: "9415057005 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.jointMinister"),
        name: "श्री अनिल खरय़ा",
        address: "ए-3,संजय उपवन कालोनी, सी.एच.सी. अपोलो हास्पीटल के पीछे,ऍम .आइ.जी .के पास, इंदौर",
        mobile: "9981128886 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.jointMinister"),
        name: "श्री नितिन सरावगी",
        address: "169, वासुदेव ,बड़ा बाज़ार ,झाँसी",
        mobile: "9415031136 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.jointMinister"),
        name: "श्री मैथिलीशरण सेठ",
        address: "642, खाती बाबा, कमलसिंग कालोनी,झाँसी",
        mobile: "9415401600 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.jointMinister"),
        name: "श्री बसंत तपा",
        address: "राधा बल्लभ वार्ड ,गाडरवारा जिला -नरसिंगपुर",
        mobile: "9826829228 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.developmentMinister"),
        name: "श्री मनोज चौधरी",
        address: "बड़ा बाज़ार ,पिछोर जिला -शिवपुरी",
        mobile: "9425763324 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.developmentMinister"),
        name: "श्री पुरषोत्तम पोद्धार",
        address: "पोद्धार ज्वेलर्स , इन्द्रगड़ जिला -दतिया",
        mobile: "9893877819 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.developmentMinister"),
        name: "श्री मोहन मिसुरिया",
        address: "5 /122 पुराना गाड़ीअड्डा रोड , डबरा",
        mobile: "9425481665 ",
        image: "/executive/member-7.webp"
      },
      {
        position: t("allAssembly.positions.developmentMinister"),
        name: "श्री राजकुमार लोहिया",
        address: "पूजा ज्वेलर्स ,सराफा बाज़ार ,इतवारी ,नागपुर",
        mobile: "0712 - 221813 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.organisationMinister"),
        name: "श्री धनिराम कनकने",
        address: "ठाकुर कालोनी ,मोहन नगर , दुर्ग",
        mobile: "09827180913 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.organisationMinister"),
        name: "श्री रमेश मलैया",
        address: "सी. 5556, राज श्री पुरम, लखनऊ ",
        mobile: "9415114356 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.organisationMinister"),
        name: "श्री अशोक नौगरैया",
        address: "163 ,सेंट्रल फोसीलिटी बिलिडिंग सेक्टर ,19 वासी (न्यू बोम्बे)",
        mobile: "09820341782 ",
        image: "/executive/member-8.webp"
      },
      {
        position: t("allAssembly.positions.organisationMinister"),
        name: "श्री जगदम्बा प्रसाद सुहाने",
        address: "74 /99 धन कुट्टी ,कानपूर",
        mobile: "9795115747   ",
        image: "/executive/member-9.webp"
      },
      {
        position: t("allAssembly.positions.assistantMinister"),
        name: "श्री पुरषोत्तम बरसैया",
        address: "द्वारा -महेश बलेचा का मकान,स्वर्णकार कालोनी ,विदिशा ",
        mobile: "9425431588 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.assistantMinister"),
        name: "श्री पुरषोत्तम बरसैया",
        address: "द्वारा -महेश बलेचा का मकान,स्वर्णकार कालोनी ,विदिशा ",
        mobile: "9425431588 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.assistantMinister"),
        name: "श्री रमेश लोहिया",
        address: "भोपाल ",
        mobile: "",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.assistantMinister"),
        name: "श्री कालीचरण मोदी",
        address: "मोदी सदन ,ठाकुर बाबा रोड ,डबरा",
        mobile: "9685233127 ",
        image: "/executive/member-10.webp"
      },
      {
        position: t("allAssembly.positions.assistantMinister"),
        name: "श्री संतोष कुरेले",
        address: "आनंद टाकीज के पास ,दतिया ",
        mobile: "9425113401 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.assistantMinister"),
        name: "श्री संतोष कुरेले",
        address: "आनंद टाकीज के पास ,दतिया ",
        mobile: "9425113401 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.assistantMinister"),
        name: "श्री दिलीप लोहिया",
        address: "फ्लेट न. 805 ,सत्यम रेसीडेंसी ,सत्यदेव नगर , गाँधी रोड, ग्वालियर ",
        mobile: "9827221215 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.memberOfTheCommittee"),
        name: "श्री कैलाशनारायण सावला",
        address: "5/45 कृष्णपुरा, डबरा जिला- ग्वालियर",
        mobile: "09425481606 ",
        image: "/executive/member-11.webp"
      },
      {
        position: t("allAssembly.positions.memberOfTheCommittee"),
        name: "श्री हरिनारायण बडेरिया",
        address: "बी-144 , ग्रीन पार्क कालोनी ,बेरसिया रोड भोपाल",
        mobile: "9425301237 ",
        image: "/executive/member-12.webp"
      },
      {
        position: t("allAssembly.positions.memberOfTheCommittee"),
        name: "श्री द्वारिका प्रसाद सुहाने",
        address: "418 -गोपाल गंज ,मोनीबाबा मंदिर के पीछे उरई जिला - जालोन",
        mobile: "09451317617 ",
        image: "/executive/member-13.webp"
      },
      {
        position: t("allAssembly.positions.memberOfTheCommittee"),
        name: "श्रीमति शोभाखरैया",
        address: "40 ,खेरा नर्सिंग होम ,बड़ा बाज़ार, पन्ना  ",
        mobile: "",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.memberOfTheCommittee"),
        name: "श्री दिनेश गेंडा",
        address: "खोड (शिवपुरी)",
        mobile: "",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.memberOfTheCommittee"),
        name: "श्री भारत नीखरा",
        address: "जेपीका हॉउस ,म.न. 3 ,व्हाइट चर्च कालोनी इंदौर",
        mobile: "9425057286 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.memberOfTheCommittee"),
        name: "श्री रमेश सुहाने",
        address: "विनोद ट्रेडिंग कंपनी ,ए.बी. रोड ,शिवपुरी",
        mobile: "9425136173 ",
        image: "/executive/img-8.webp"
      },
 ],
    projectOfficials: [
      {
        position: t("allAssembly.positions.chairmanTribunal"),
        name: "श्री सुन्दरलाल नौगरैया (पूर्ब न्याय़धीश )",
        address: " ऍम.आइ.जी .173 ,माधव नगर ,ग्वालियर",
        mobile: "09425112036 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.ministerTribunal"),
        name: "श्री ब्रिजेश कुमार गुप्ता (मतेले) एडवो.",
        address: "मुख्य डाकखाने के पास ,भिंड",
        mobile: "9425129575 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.chairmanAkshayNidhi"),
        name: "श्री सुभास कुचिया (पूर्ब आयकर अधिकारी)",
        address: "वार्ड न. 27 ,गुप्ता काम्पलेक्स ,प्रेम नगर बालाघाट",
        mobile: "09425146302 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.chairmanGahoiGlobalCheCom"),
        name: "श्री योगेश नौगरैया",
        address: "ई 1 /121 ,अरेरा कालोनी ,भोपाल",
        mobile: "09827052676 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.ministerGahoiGlobalCheCom"),
        name: "श्री सुभाष खर्द",
        address: "91 /92 ,सिविल लाइन , झाँसी",
        mobile: "09415031397 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.chairmanShasEmployee"),
        name: "श्री रामगोपाल नीखरा",
        address: "मोटे गणेश जी मंदिर के पास, खासगी बाज़ार ग्वालियर ",
        mobile: "09425243435 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.ministerShasEmployee"),
        name: "श्री विनोद सिपौलिया",
        address: "नेताजी चोक ,दुर्गा मंदिर के पास, न्यू शांति नगर ,रायपुर ",
        mobile: "9424218451 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.chairmanPolitician"),
        name: "श्री जुगलकिशोर इटोरिया",
        address: "ई -6 , 42 अरोरा कालोनी ,भोपाल ",
        mobile: "09826025346 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.chairmanPolitician"),
        name: "श्री जुगलकिशोर इटोरिया",
        address: "ई -6 , 42 अरोरा कालोनी ,भोपाल ",
        mobile: "09826025346 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.ministerPolitician"),
        name: "श्री राजकुमार नीखरा",
        address: "सागर कंसयानी प्रा.लिम. कासिम खां का बड़ा ,दाल बाज़ार,ग्वालियर ",
        mobile: "09826344311 ",
        image: "/executive/member-14.webp"
      },
      {
        position: t("allAssembly.positions.gahoiWelfareFund"),
        name: "श्री कैलाश नारायण सुहाने",
        address: "ई -२5,अरेरा कालोनी ,भोपाल",
        mobile: "09452012411 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.minister"),
        name: "श्री अलोक टिकरिया",
        address: "383 ,टिकरया मार्ग ,छतरपुर",
        mobile: "9425304544 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.presidentAllIndiaGahoiVaishyaWomen"),
        name: "श्रीमती संध्या नगरिया",
        address: "कोठी न. 8 प्रियंका नगर, कोलार रोड,भोपाल मोबा",
        mobile: "09893041693 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.ministerMinisterAllIndiaGahoiVaishyaWomen"),
        name: "श्रीमती रजनी रावत",
        address: "ग्वाल मंगरा तालाब के पास, छतरपुर",
        mobile: "09425146234 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.presidentAllIndiaGahoiVaishya"),
        name: "श्री प्रोमोद सेठ (भारती )",
        address: "करेरा, जिला शिवपुरी",
        mobile: "09425489922 ",
        image: "/executive/member-15.webp"
      },
      {
        position: t("allAssembly.positions.ministerMinisterAllIndiaGahoiVaishyaYouthCouncil"),
        name: "श्री राहुल नगरिया",
        address: "घंटा घर चौराहा, मेन रोड, उरई",
        mobile: "09415153212 ",
        image: "/executive/member-16.webp"
      },
      {
        position: t("allAssembly.positions.presidentAllIndiaGahoiVaishyaSeniorAssociation"),
        name: "श्री गनपत राम निखरा",
        address: "विवेकानंद कालोनी, फलका बाज़ार, ग्वालियर मोबा",
        mobile: "09425113476 ",
        image: "/executive/member-19.webp"
      },
      {
        position: t("allAssembly.positions.ministerMinisterAllIndiaGahoiVaishyaSeniorAssociation"),
        name: "श्री एम. सी. सुहाने",
        address: "2 बी/540 वसुन्धरा, गाज़ियाबाद",
        mobile: "09873666369 ",
        image: "/executive/img-8.webp"
      },
      {
        position: t("allAssembly.positions.chiefElectionCommissioner"),
        name: "श्री आर. एन. गुप्ता",
        address: "ग्वालियर",
        mobile: "09425111349 ",
        image: "/executive/member-17.webp"
      },
      {
        position: t("allAssembly.positions.coordinatorCensus"),
        name: "श्री कुबेर चन्द्र रेजा",
        address: "भोपाल",
        mobile: "09303135377 ",
        image: "/executive/member-18.webp"
      },
    ],
    GahoiBandhuEditorialBoard: [
      {
        position: t("allAssembly.positions.nationalPresident"),
        name: "राधेश्याम कुचिया",
        address: "",
        mobile: "09425114006",
        image: "/executive/member-21.webp"
      },
      {
        position: t("allAssembly.positions.executivePresident"),
        name: "उमा शंकर लहारिया (प्रबंध संपादक )",
        address: "जबलपुर",
        mobile: "09425150272",
      image: "/executive/member-20.webp"
      },
    ]
  };

  const OfficialCard = ({ official }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-red-200/50 transition-shadow duration-300 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent z-10"></div>
        <img
          src={official.image}
          alt={official.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "/resources/default-profile.webp";
          }}
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 z-20 flex justify-center">
          <div className="bg-red-800/90 backdrop-blur-sm rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 inline-block">
            <h3 className="text-white font-medium text-xs sm:text-sm md:text-base text-center whitespace-normal leading-tight">
              {official.position}
            </h3>
          </div>
        </div>
      </div>
      <div className="p-1.5 sm:p-2 md:p-3 text-center">
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-red-800 mb-0.5 sm:mb-1">
          {official.name}
        </h2>
        <div className="space-y-0.5 text-gray-700 text-xs sm:text-sm">
          <p className="leading-tight">{official.address}</p>
          <p className="font-medium">{official.mobile}</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    let data;
    let title;
    
    switch(activeTab) {
      case "2015":
        data = Assembly2015Data;
        title = t("allAssembly.nominatedOfficials.2015");
        break;
      case "2019":
        data = Assembly2019Data;
        title = t("allAssembly.nominatedOfficials.2019");
        break;
      default:
        data = ExecutiveCentralData;
        title = t("allAssembly.executiveList.title");
    }

    return (
      <>
        <div className="text-center py-3 sm:py-3 md:py-4 mb-3 sm:mb-3 md:mb-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border-2 border-red-200/50 p-3 sm:p-4 md:p-6">
            <div className="inline-block bg-red-800 rounded-full px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 shadow-lg">
              <p className="text-base sm:text-lg md:text-xl font-medium text-white">
                {title}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border-2 border-red-200/50 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-red-800 mb-4 sm:mb-5 md:mb-6 text-center">
            {title}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-4 md:gap-6 lg:gap-8">
            {data.officials.map((official, index) => (
              <OfficialCard key={index} official={official} />
            ))}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border-2 border-red-200/50 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-red-800 mb-4 sm:mb-5 md:mb-6 text-center">
            {t(`allAssembly.nominatedOfficials.${activeTab}`)}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-4 md:gap-6 lg:gap-8">
            {data.nominatedOfficials?.map((official, index) => (
              <OfficialCard key={index} official={official} />
            ))}
          </div>
        </div>

        {data.projectOfficials && data.projectOfficials.length > 0 && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border-2 border-red-200/50 p-3 sm:p-4 md:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-red-800 mb-4 sm:mb-5 md:mb-6 text-center">
              {t("allAssembly.projectOfficials.title")}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-4 md:gap-6 lg:gap-8">
            {data.projectOfficials.map((official, index) => (
              <OfficialCard key={index} official={official} />
            ))}
          </div>
        </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t("allAssembly.meta.title")}</title>
        <meta name="description" content={t("allAssembly.meta.description")} />
      </Helmet>

      <div className="relative w-full bg-red-800 pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src="/all-assembly-hero.webp"
          alt="All Assembly Background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="p-3 md:p-5 bg-white/10 rounded-full w-20 h-20 mx-auto mb-6 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              {t("allAssembly.title")}
            </h1>
            <p className="text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto">
              {t("allAssembly.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-8">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-red-100 p-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab("2019")}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "2019"
                  ? "bg-red-800 text-white"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {t("allAssembly.tabs.2019")}
            </button>
            <button
              onClick={() => setActiveTab("2015")}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "2015"
                  ? "bg-red-800 text-white"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {t("allAssembly.tabs.2015")}
            </button>
            <button
              onClick={() => setActiveTab("central")}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "central"
                  ? "bg-red-800 text-white"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              {t("allAssembly.tabs.central")}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {renderContent()}
      </div>
    </div>
  );
};

export default AllAssembly; 