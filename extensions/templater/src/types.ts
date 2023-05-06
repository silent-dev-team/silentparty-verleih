export type TemplateData = {
    values: { [key: string]: string   },
    tables?: { [key: string]: TableData }
}

type TableData = {
    rows: { [key: string]: string  }[]
}