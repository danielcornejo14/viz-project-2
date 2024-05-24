import { promises as fs } from 'fs'
import TreeInBunchesRevamp from './components/TreeInBunchesRevamp';
import TreeInBunches from './components/TreeInBunches';


export default async function Home() {

  const cwd = process.cwd();

  const costaRicaDataFile = await fs.readFile(cwd + '/public/data/distritosHierarchy.json', 'utf8');
  const costaRicaData = JSON.parse(costaRicaDataFile);

  const flareDataFile = await fs.readFile(cwd + '/public/data/flareHierarchy.json', 'utf8');
  const flareData = JSON.parse(flareDataFile);

  const vueDataFile = await fs.readFile(cwd + '/public/data/vueHierarchy.json', 'utf8');
  const vueData = JSON.parse(vueDataFile);


  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <h1>Costa Rica</h1>
        <TreeInBunches width={950} height={950} data={costaRicaData}></TreeInBunches>
        <TreeInBunchesRevamp width={950} height={950} data={costaRicaData}></TreeInBunchesRevamp>
      </div>
      <div className="flex flex-col">
        <h1>Flare</h1>
        <TreeInBunches width={950} height={950} data={flareData}></TreeInBunches>
        <TreeInBunchesRevamp width={950} height={950} data={flareData}></TreeInBunchesRevamp>
      </div>
      <div className="flex flex-col">
        <h1>Vue</h1>
        <TreeInBunches width={950} height={950} data={vueData}></TreeInBunches>
        <TreeInBunchesRevamp width={950} height={950} data={vueData}></TreeInBunchesRevamp>
      </div>
    </div>

  );
}
