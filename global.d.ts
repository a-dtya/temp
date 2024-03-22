import { Database as DB } from './lib/supabase/database.types'

declare global {
    type Database = DB
}