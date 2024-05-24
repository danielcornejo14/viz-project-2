import { promises as fs } from 'fs'
import ForceSimulationTree from './components/TreeInBunches';


export default async function Home() {

  const cwd = process.cwd();

  const costaRicaDataFile = await fs.readFile(cwd+'/public/data/flareHierarchy.json', 'utf8');
  const costaRicaData = JSON.parse(costaRicaDataFile);


  return (
   <ForceSimulationTree width={950} height={950} data={costaRicaData}></ForceSimulationTree>
  );
}
