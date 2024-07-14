import React from 'react'
import { LANGUAGES } from '../utils/presets';

export default function Translation(props) {
  const { textElement, toLang, setToLang, translating, generateTranslation } = props;

  return (
    <div className='flex flex-col mx-auto items-center max-w-[400px] w-full gap-4'>
    {(textElement && !translating) && (<p>{textElement}</p>)}
      {!translating && (<div className='flex flex-col gap-4'>
        <p className='font-medium text-slate-500 mr-auto text-xs sm:text-sm'>Select your language:</p>

        <div className='flex items-stretch'>
          <select className='flex-1 bg-white outline-none focus:outline-none border border-solid border-transparent shadow-sm hover:border-teal-200 duration-200 p-3 rounded-lg' value={toLang} onChange={(e) => setToLang(e.target.value)}>
            <option value='Select language'>Select language</option>
            {Object.entries(LANGUAGES).map(([key, value]) => {
              return (
                <option key={key} value={value}>{key}</option>
              )
            })
            }
          </select>
          <button className='translate bg-white shadow-sm px-4 mx-3 p-2 rounded-lg hover:text-teal-400 duration-200' onClick={generateTranslation}>Translate</button>
        </div>

      </div>)}

    </div>
  )
}
