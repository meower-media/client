/**
 * @typedef {{
 * 	id: any,
 * 	post_id: any,
 * 	user: string,
 * 	content: string,
 * 	date: number,
 * }} ListPost
 */

/**
 * @typedef {{
 * 	_id: string,
 * 	isDeleted: boolean,
 * 	p: string,
 * 	post_id: string,
 * 	post_origin: string,
 * 	t: {
 * 		d: string,
 * 		e: number,
 * 		h: string,
 * 		mi: string,
 * 		mo: string,
 * 		s: string,
 * 		y: string
 * 	},
 * 	type: number,
 * 	u: string
 * }} ServerPost
 */

/**
 * @typedef {{
 * 	autoget: Array<ServerPost>,
 * 	error: boolean,
 * 	"page#":  number,
 * 	pages: number
 * }} ServerPostList
 */

// make vscode recognize this as a module
export {};

/**
 * @typedef {{
 *  id: string,
 *  username: string,
 *  public_flags: string,
 *  icon: string
 * }} PartialProfile
 */

/**
 * @typedef {PartialProfile & {
 *  created: number,
 *  theme: object,
 *  quote: string,
 *  badges: Array,
 *  stats: object
 * }} Profile
 */

/**
 * @typedef {Profile & {
 *  flags: number,
 *  admin: number
 * }} User
 */

/**
 * @typedef {{
 *  id: string,
 *  email: string,
 *  auth_methods: Array<string>,
 *  last_updated: number
 * }} Account
 */

/**
 * @typedef {{
 *  id: string,
 *  user: PartialProfile,
 *  device: any,
 *  country: string,
 *  last_refreshed: number,
 *  created: number
 * }} Session
 */

/**
 * @typedef {{
 *  id: string,
 *  name: string,
 *  description: string,
 *  flags: number,
 *  created: number
 * }} PublicApplication
 */

/**
 * @typedef {PublicApplication & {
 *  owner_id: string,
 *  maintainers: Array<PartialProfile>
 * }} Application
 */

/**
 * @typedef {{
 *  id: string,
 *  recipient: PartialProfile,
 *  type: number,
 *  content?: string,
 *  user?: PartialProfile,
 *  post?: Post,
 *  comment?: any,
 *  milestone?: number
 * }} Notification
 */

/**
 * @typedef {{
 *  likes: number,
 *  meows: number,
 *  comments: number
 * }} PostStats
 */

/**
 * @typedef {{
 *  id: string,
 *  author: PartialProfile,
 *  masquerade: any,
 *  public_flags: number,
 *  stats: PostStats,
 *  content: string,
 *  filtered_content?: string,
 *  time: number,
 *  delete_after?: number
 * }} Post
 */

/**
 * @typedef {Post & {
 *  flags: number,
 *  top_stats: PostStats,
 *  deleted_at?: number
 * }} AdminPost
 */

/**
 * @typedef {{
 *  id: string,
 *  post_id: string,
 *  parent_id?: string,
 *  author: PartialProfile,
 *  masquerade: any,
 *  public_flags: number,
 *  likes: number,
 *  content: string,
 *  filtered_content?: string,
 *  time: number,
 *  delete_after?: number
 * }} Comment
 */

/**
 * @typedef {Comment & {
 *  flags: number,
 *  top_likes: number,
 *  deleted_at?: number
 * }} AdminComment
 */
