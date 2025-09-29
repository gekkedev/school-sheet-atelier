import { DEUTSCH_SUBJECT } from "./topics.de"
import { RELIGION_SUBJECT } from "./topics.reli"
import type { Subject } from "./topics.types"

export type { Grade, SubjectId, Topic, Category, Subject } from "./topics.types"

export const SUBJECTS: Subject[] = [DEUTSCH_SUBJECT, RELIGION_SUBJECT]
