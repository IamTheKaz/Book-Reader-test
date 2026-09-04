import { t as createServerFn } from "./ssr.mjs";
import { n as getSql, t as createServerRpc } from "./db-C6EIAQY0.mjs";
import { i as randomBytes, n as bytesToHex, r as hexToBytes, t as scrypt } from "../_libs/noble__hashes.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teacher-CUKRRW0v.js
var SCRYPT_OPTS = {
	N: 2 ** 15,
	r: 8,
	p: 1,
	dkLen: 32
};
/** Hash a password with a fresh random salt (scrypt, hex-encoded). */
function hashPassword(password) {
	const salt = bytesToHex(randomBytes(16));
	return {
		hash: bytesToHex(scrypt(password, hexToBytes(salt), SCRYPT_OPTS)),
		salt
	};
}
/** Constant-time-ish comparison of a candidate against the stored hash. */
function verifyPassword(password, salt, expected) {
	return bytesToHex(scrypt(password, hexToBytes(salt), SCRYPT_OPTS)) === expected;
}
var TEACHER_KEY = "teacher";
/** True once a shared teacher password has been set. */
var getTeacherStatus_createServerFn_handler = createServerRpc({
	id: "4f6d0050629100f17e6ad798c6dd96090c3b7f92fde95153896b47bf43c06733",
	name: "getTeacherStatus",
	filename: "src/server/teacher.ts"
}, (opts) => getTeacherStatus.__executeServer(opts));
var getTeacherStatus = createServerFn({ method: "GET" }).handler(getTeacherStatus_createServerFn_handler, async () => {
	const rows = await (await getSql())`select password_hash, salt from app_config where id = ${TEACHER_KEY}`;
	return { hasPassword: Boolean(rows[0]?.password_hash) };
});
var setTeacherPassword_createServerFn_handler = createServerRpc({
	id: "cee2d11779fc2bf39d94c5502b054f357ee042be15c1e8ab053600561356ed90",
	name: "setTeacherPassword",
	filename: "src/server/teacher.ts"
}, (opts) => setTeacherPassword.__executeServer(opts));
var setTeacherPassword = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.password !== "string" || input.password.trim().length < 4) throw new Error("Choose a password of at least 4 characters.");
	return { password: input.password.trim() };
}).handler(setTeacherPassword_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if ((await sql`select password_hash from app_config where id = ${TEACHER_KEY}`)[0]?.password_hash) return {
		ok: false,
		alreadySet: true
	};
	const { hash, salt } = hashPassword(data.password);
	await sql`
      insert into app_config (id, password_hash, salt, updated_at)
      values (${TEACHER_KEY}, ${hash}, ${salt}, now())
      on conflict (id) do update set password_hash = ${hash}, salt = ${salt}, updated_at = now()
    `;
	return { ok: true };
});
var verifyTeacherPassword_createServerFn_handler = createServerRpc({
	id: "a68c30833b8ec422f1ef2f159d1f4a3d677a85476606e3aa7c69a9641d45f3b9",
	name: "verifyTeacherPassword",
	filename: "src/server/teacher.ts"
}, (opts) => verifyTeacherPassword.__executeServer(opts));
var verifyTeacherPassword = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.password !== "string") throw new Error("Password required.");
	return { password: input.password };
}).handler(verifyTeacherPassword_createServerFn_handler, async ({ data }) => {
	const row = (await (await getSql())`select password_hash, salt from app_config where id = ${TEACHER_KEY}`)[0];
	if (!row?.password_hash || !row.salt) return { ok: false };
	return { ok: verifyPassword(data.password, row.salt, row.password_hash) };
});
//#endregion
export { getTeacherStatus_createServerFn_handler, setTeacherPassword_createServerFn_handler, verifyTeacherPassword_createServerFn_handler };
