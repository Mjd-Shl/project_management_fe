export type WorkspaceMember = {
  id: string
  name: string
  avatarUrl: string | null
}

export type Project = {
  id: string
  name: string
  key: string
  color: string
  description: string
  openTaskCount: number
  progress: number
  members: WorkspaceMember[]
  archived: boolean
}

export type WorkspacePermissions = {
  canCreate: boolean
  canEdit: boolean
  canArchive: boolean
  canViewArchived: boolean
}

export type ProjectValues = {
  name: string
  key: string
  color: string
  description: string
  memberIds: string[]
}

export type ProjectUpdateValues = ProjectValues
