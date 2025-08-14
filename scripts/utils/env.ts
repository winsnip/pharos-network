interface EnvContentParams {
     envContent: string,
     key: string,
     value: string,
}

export function updateEnvContent({
     envContent,
     key,
     value,
}: EnvContentParams): string {
     const lines = envContent.split(/\r?\n/)
     let found = false
     const newLines = lines.map(line => {
          if (line.startsWith(`${key}=`)) {
               found = true
               return `${key}=${value}`
          }
          return line
     })

     if (!found) newLines.push(`${key}=${value}`)
     return newLines.join("\n")
}
