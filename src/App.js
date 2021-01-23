import * as React from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = React.useState(true)
  const [store, setStore] = React.useState(() => {})
  const [parse, setParse] = React.useState(() => {})
  const [records, setRecords] = React.useState([])

  React.useEffect(() => {
    import('./wasm-build/csvlib').then(({ parse, store }
    ) => {
      const source = '2,3,4\n12,13,14\n22,23,24\n';
      console.log('Source:')
      console.log(source)

      setRecords(parse(source))
      setParse(() => parse)
      setStore(() => store)
      setLoading(false)
    })
  }, [])

  const onClick = () => {
    const value = prompt('Add a new row. Floats separated by commas:')
    const items = parse(`${value}\n`)

    setRecords([...records, ...items])
  }

  const onRetrieve = () => {
    const source = store(records)
    const markdown = `\`\`\`\n${source}\n\`\`\``

    console.log('Markdown:')
    console.log(markdown)
  }

  return (
    <div className="App">
      {loading && (
        <div>
          Loading...
        </div>
      )}
      <table className="table-auto border-collapse border border-green-800">
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              {record.fields.map((field, index) => (
                <td key={index} className="border-2 border-green-600 px-6 py-2">
                  {field.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-row gap-4 p-8">
        <button onClick={onClick} className="w-48 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          <span>Add new row</span>
        </button>

        <button onClick={onRetrieve} className="w-48 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
          <span>Retrieve Markdown</span>
        </button>
      </div>
    </div>
  );
}

export default App;
