import {useGlobalStore} from "../store/global/GlobalStore";
import {useGroupDuplicates} from "../hooks/duplicateTable/useGroupDuplicates";

export const DuplicatesTable: React.FC = () => {
  const csvDataToDisplay = useGlobalStore((s) => s.csvDataToDisplay);
  const {groupDuplicates} = useGroupDuplicates();

  const groupedDuplicates = groupDuplicates(csvDataToDisplay);

  console.log("%c ", "background: pink; color: black", groupedDuplicates);

  return (
    <div>
      {groupedDuplicates.map((group) => {
        return <div>asd</div>;
      })}
    </div>
  );
};
