import { promises as fs } from 'fs'
import TreeInBunchesRevamp from './components/TreeInBunchesRevamp';
import TreeInBunches from './components/TreeInBunches';


export default async function Home() {

  const cwd = process.cwd();

  const costaRicaDataFile = await fs.readFile(cwd + '/public/data/flareHierarchy.json', 'utf8');
  const costaRicaData = JSON.parse(costaRicaDataFile);


  return (
    <><TreeInBunches width={950} height={950} data={costaRicaData}></TreeInBunches><TreeInBunchesRevamp width={950} height={950} data={costaRicaData}></TreeInBunchesRevamp></>
  );
}
