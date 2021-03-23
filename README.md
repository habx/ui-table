
# React Table UI

[![CircleCI](https://img.shields.io/circleci/build/github/habx/ui-table)](https://app.circleci.com/pipelines/github/habx/ui-table)
[![Version](https://img.shields.io/npm/v/@habx/ui-table)](https://www.npmjs.com/package/@habx/ui-table)
[![Size](https://img.shields.io/bundlephobia/min/@habx/ui-table)](https://bundlephobia.com/result?p=@habx/ui-table)
[![License](https://img.shields.io/github/license/habx/ui-table)](/LICENSE)


UI components for [react-table](https://github.com/tannerlinsley/react-table) based on [ui-core](https://github.com/habx/ui-core)

![Preview-light](https://res.cloudinary.com/habx/image/upload/v1616506914/tech/ui-table/table-light.png)
![Preview-dark](https://res.cloudinary.com/habx/image/upload/v1616506987/tech/ui-table/table-dark.png)


## Installation
```shell 
npm i @habx/ui-table
 ```

## Features

* Fixed headers
* React table built in plugins
* Infinite scroll
* Import/export

Test all our components in our [Storybook](https://habx.github.io/ui-table/)

### Basic usage

````typescript jsx
  const tableInstance = useTable({
    data: FAKE_DATA,
    columns: BASIC_COLUMNS,
  })

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
````


### Import / Export

Import and export your data in `.xlsx` or `.csv` thanks to [exceljs](https://github.com/exceljs/exceljs)

![Preview-imex](https://res.cloudinary.com/habx/image/upload/v1616507243/tech/ui-table/imex.gif)


#### Columns Example

```typescript jsx
export const IMEX_COLUMNS = [
  {
    Header: 'Email',
    accessor: 'email',
    meta: {
      imex: {
        type: 'string' as const,
      },
    },
  },
  {
    Header: 'Age',
    accessor: 'age',
    meta: {
      imex: {
        type: 'number' as const,
      },
    },
  },
]
```

#### Export
````typescript jsx
  const tableInstance = useTable({
    data,
    columns,
  })
  const [downloadTableData] = useExportTable({
    data: FAKE_DATA,
    columns: IMEX_COLUMNS,
  })
````

#### Import
````typescript jsx
    const tableInstance = useTable({
      data,
      columns,
    })
    const upsertRow = () => new Promise((resolve) => setTimeout(resolve, 1000))
    const importTable = useImportTable({
      columns,
      upsertRow: upsertRow,
      getOriginalData: () => data,
    })

    return (
        <Container>
          <ActionBar>
            <Button outline onClick={importTable.browseLocalFiles}>
              Import
            </Button>
          </ActionBar>
          <input {...importTable.inputProps} />
        </Container>
    )
````
