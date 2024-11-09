import { memoize } from '@std/cache/memoize'
import { retry } from '@std/async/retry'
import type { IssueData, MatchData } from './types.ts'

const ISSUE_URL_REGEX_SOURCE = String.raw`https://github.com/[a-zA-Z0-9-]+/[a-zA-Z0-9-]+/issues/\d+`

const x = await new Deno.Command('rg', {
	args: ['--json', ISSUE_URL_REGEX_SOURCE],
	stdout: 'piped',
}).spawn().output()

const t = new TextDecoder().decode(x.stdout)
const d: MatchData[] = t.split('\n').filter(Boolean).map((x) => JSON.parse(x))
	.filter((x) => x.type === 'match')
	.map((x) => x.data)

const getIssueData = memoize(function getIssueData(endpoint: string): Promise<IssueData> {
	return retry(async () => {
		const res = await fetch(endpoint)

		if (!res.ok) {
			throw new Error(`HTTP ${res.status} ${res.statusText}`)
		}

		return await res.json() as IssueData
	}, { maxAttempts: 3 })
})

const results = await Promise.all(d.map(async (x) => {
	const { path: { text: path }, line_number, submatches: { 0: { match: { text: href } } } } = x

	const url = new URL(href)
	const endpoint = `https://api.github.com/repos${url.pathname}`

	const issueData = await getIssueData(endpoint)

	const { state, state_reason } = issueData

	return { path, line_number, href, state, state_reason }
}))

console.log(results)
