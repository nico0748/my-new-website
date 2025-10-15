// SVGアイコンデータ
const SvgIcons = {
  github: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.803 8.207 11.385.6.113.818-.261.818-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.542-1.355-1.325-1.716-1.325-1.716-1.09-.744.082-.729.082-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.835 2.809 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.124-3.179 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.665 1.656.26 2.876.12 3.179.77.84 1.235 1.911 1.235 3.22 0 4.61-2.801 5.626-5.476 5.925.42.36.81 1.015.81 2.04 0 1.472-.014 2.65-.014 3.003 0 .318.219.695.825.578 4.771-1.581 8.202-6.082 8.202-11.385.001-6.627-5.372-12-11.999-12z" /></svg>
  ),
  xTwitter: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
  )
};

// プロフィールデータ
export const profileData = {
  name: 'Nico',
  title: 'フロントエンドエンジニア',
  bio: `
    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; font-weight: bold; width: 100%; margin-top: 10px; text-align: left; ">
      <tr>
        <th colspan="2" style="text-align: center; font-size: 32px;">About Me</th>
      </tr>
      <tr>
        <td style="font-size: 22px;">Educ</td>
        <td style="font-size: 16px;">Chiba Institute of Technology — B2</td>
      </tr>
      <tr>
        <td style="font-size: 22px;">Major</td>
        <td style="font-size: 16px;">Information Engineering</td>
      </tr>
      <tr>
        <td style="font-size: 22px;">Role</td>
        <td style="font-size: 16px;">Software Engineer — Web Frontend / Game Engineer / 3D Modeler</td>
      </tr>
      <tr>
        <td style="font-size: 22px;">Hobby</td>
        <td style="font-size: 16px;">App Game / Anime</td>
      </tr>
    </table>
  `,
  imageUrl: '/sns_icon_round.png',
  socialLinks: [
    { name: 'X (Twitter)', url: '#', icon: SvgIcons.xTwitter },
    { name: 'GitHub', url: '#', icon: SvgIcons.github },
    { name: 'Note', url: '#', icon: <span className="text-xl font-bold">Note</span> },
    { name: 'Qiita', url: '#', icon: <span className="text-xl font-bold">Qiita</span> }
  ]
};