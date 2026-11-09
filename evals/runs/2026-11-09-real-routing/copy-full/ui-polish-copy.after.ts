import { I18nManager, type LanguageCode } from './i18n';

type Copy = { friendlyTitle: string; rankedHint: string; puzzlePolicy: string };
const rows: Record<LanguageCode, readonly [string, string, string]> = {
  ko: ['온라인 친선전', '초대 코드로 대전 · 랭크는 로그인 필요', '연구·전략 덱·런 카드 미적용. 승급·킹 특수 능력 사용 불가. 타점은 자유롭게 설정할 수 있습니다.'],
  en: ['Online friendly game', 'Play by invite code · Sign in for ranked', 'Research, strategy decks and run cards do not apply. Promotion and King abilities are disabled. Strike points can be adjusted freely.'],
  ja: ['オンライン親善対戦', '招待コードで対戦 · ランク戦はログインが必要', '研究・戦略デッキ・ランカードは適用されません。昇格とキングの特殊能力は使用できません。打点は自由に設定できます。'],
  'zh-CN': ['在线友谊赛', '通过邀请码对战 · 排位需登录', '不应用研究、策略牌组或挑战卡。不可升变或使用国王特殊能力，可自由调整击球点。'],
  de: ['Online-Freundschaftsspiel', 'Per Einladungscode spielen · Rangliste erfordert Anmeldung', 'Forschung, Strategiedecks und Laufkarten gelten nicht. Umwandlung und Königsfähigkeiten sind deaktiviert. Treffpunkte sind frei einstellbar.'],
  fr: ['Partie amicale en ligne', 'Jouer par code · Connexion requise pour le classé', 'La recherche, les decks stratégiques et les cartes de parcours ne s’appliquent pas. Promotion et pouvoirs du roi désactivés. Le point de frappe est libre.'],
  es: ['Partida amistosa en línea', 'Juega con código · Inicia sesión para clasificatorias', 'No se aplican investigación, mazos de estrategia ni cartas de recorrido. Sin promoción ni habilidades del rey. El punto de golpe es libre.'],
  ru: ['Дружеский матч онлайн', 'Игра по коду · Для рейтинга нужен вход', 'Исследования, стратегические колоды и карты забега не применяются. Превращение и способности короля отключены. Точку удара можно выбирать свободно.'],
  'pt-BR': ['Partida amistosa online', 'Jogue por código · Entre para jogar ranqueadas', 'Pesquisa, decks de estratégia e cartas da jornada não se aplicam. Promoção e habilidades do rei estão desativadas. O ponto de impacto é livre.'],
};
export function uiPolishCopy(lang: LanguageCode = I18nManager.currentLang): Copy {
  const [friendlyTitle, rankedHint, puzzlePolicy] = rows[lang] ?? rows.en;
  return { friendlyTitle, rankedHint, puzzlePolicy };
}
