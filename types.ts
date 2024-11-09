// ripgrep types
export type SubMatch = {
	match: { text: string }
	start: number
	end: number
}

export type MatchData = {
	path: { text: string }
	lines: { text: string }
	line_number: number
	absolute_offset: number
	submatches: [SubMatch, ...SubMatch[]]
}

// github API types
// just a subset of https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#get-an-issue
export type IssueData = {
	id: number
	node_id: string
	url: string
	repository_url: string
	labels_url: string
	comments_url: string
	events_url: string
	html_url: string
	number: number
	state: 'open' | 'closed'
	state_reason?: 'completed' | 'reopened' | 'not_planned' | null
	title: string
	body?: string | null
	locked: boolean
	active_lock_reason?: string | null
	pull_request?: {
		merged_at?: string | null
		diff_url: string | null
		html_url: string | null
		patch_url: string | null
		url: string | null
	}
	closed_at: string | null
	created_at: string
	updated_at: string
	draft?: boolean
}
