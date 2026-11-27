import { z } from 'zod'

export const projectSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters.'),
  key: z
    .string()
    .trim()
    .regex(/^[A-Z0-9]{2,10}$/, 'Use 2–10 uppercase letters or numbers.'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Choose a project color.'),
  description: z.string().max(300, 'Description must be 300 characters or fewer.'),
  memberIds: z.array(z.string()),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

export function suggestProjectKey(name: string): string {
  return name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
}
