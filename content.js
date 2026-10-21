// EDIT THIS FILE. Everything in [square brackets] is a placeholder: replace it with your real information.
export const profile = {
  email: 'your-email@example.com',            // [EDIT] your real email
  github: 'https://github.com/your-username', // [EDIT] your real GitHub
  linkedin: '',                               // [EDIT] optional, leave '' to hide
  cvEn: '/cv/Faisal-Kabir-Rabi-CV-English.pdf',
  cvBn: '/cv/Faisal-Kabir-Rabi-CV-Bangla.pdf'
}
export const skills = [1, 2, 3, 4, 5, 6].map((n) => ({ en: `[Skill ${n}]`, bn: `[দক্ষতা ${n}]` })) // [EDIT] or manage in /admin
export const projects = [1, 2, 3].map((n) => ({
  id: n, tags: ['[Tech]', '[Tech]'], live: '#', repo: '#', // [EDIT] links and tags
  title: { en: `[Project ${n} title]`, bn: `[প্রজেক্ট ${n} এর নাম]` },
  desc: { en: '[One or two sentences about what this project does.]', bn: '[এই প্রজেক্টটি কী করে তা এক-দুই বাক্যে লিখুন।]' }
}))
export const content = {
  en: {
    name: 'Faisal Kabir Rabi', role: '[Your role, e.g. Web Developer]',
    nav: { about: 'About', skills: 'Skills', projects: 'Projects', contact: 'Contact' },
    intro: '[Write one sentence about what you build and who you build it for.]',
    aboutTitle: 'About me', about: '[Write a short paragraph about yourself, your background and what you are looking for.]',
    skillsTitle: 'Skills', projectsTitle: 'Projects', contactTitle: 'Contact',
    contactText: 'Want to work together? Send me a message.',
    cvEn: 'Download CV (English)', cvBn: 'Download CV (Bangla)', live: 'Live site', repo: 'Source code', email: 'Email', github: 'GitHub',
    viewWork: 'See projects', rights: 'All rights reserved.'
  },
  bn: {
    name: 'ফয়সাল কবির রাবি', role: '[আপনার পদবি, যেমন: ওয়েব ডেভেলপার]', // [EDIT] confirm Bangla spelling of your name
    nav: { about: 'পরিচিতি', skills: 'দক্ষতা', projects: 'প্রজেক্ট', contact: 'যোগাযোগ' },
    intro: '[আপনি কী তৈরি করেন এবং কাদের জন্য, তা এক বাক্যে লিখুন।]',
    aboutTitle: 'আমার সম্পর্কে', about: '[নিজের সম্পর্কে, আপনার পটভূমি এবং আপনি কী খুঁজছেন তা সংক্ষেপে লিখুন।]',
    skillsTitle: 'দক্ষতা', projectsTitle: 'প্রজেক্ট', contactTitle: 'যোগাযোগ',
    contactText: 'একসাথে কাজ করতে চান? আমাকে মেসেজ করুন।',
    cvEn: 'সিভি ডাউনলোড (ইংরেজি)', cvBn: 'সিভি ডাউনলোড (বাংলা)', live: 'লাইভ সাইট', repo: 'সোর্স কোড', email: 'ইমেইল', github: 'গিটহাব',
    viewWork: 'প্রজেক্ট দেখুন', rights: 'সর্বস্বত্ব সংরক্ষিত।'
  }
}
