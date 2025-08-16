import fs from 'fs'
import { supabase } from './supabaseClient.js'

async function uploadFile() {
  const filePath = './example.png'
  const fileBuffer = fs.readFileSync(filePath)

  const { data, error } = await supabase.storage
    .from('stream_history')
    .upload('uploads/example.png', fileBuffer, {
      contentType: 'image/png',
    })

  if (error) console.error(error)
  else console.log('File uploaded:', data)
}

uploadFile()
