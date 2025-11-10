import { useState } from "react";
import CustomSelectWithModal from "./CustomSelectWithModal";
import { TableRow, DhayiName } from "../types";
interface DataTableProps {
  data: TableRow[];
  dayiNames: DhayiName[];
  onChange: (data: TableRow[]) => void;
  onDelete?: (id: string) => void;
}
// DataTable Component
export const DataTable = ({ data, dayiNames, onChange }: DataTableProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleChange = (id: string, value: string) => {
    const updated = data.map((row) =>
      row.id === id ? { ...row, dai_name_contact: value } : row
    );
    onChange(updated as TableRow[]);

    const updatedSelectedOptions = (updated as TableRow[])
      .filter((row) => row.dai_name_contact !== "-")
      .map((row) => row.dai_name_contact);
    setSelectedOptions(updatedSelectedOptions);
  };

  return (
    <div className="w-full overflow-x-auto border rounded-md shadow-md bg-white">
      <table className="w-full border-collapse text-sm sm:text-base">
        <thead>
          <tr className="bg-gray-100 text-gray-800">
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
              S.No
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
              Branch Name / கிளை பெயர்
            </th>
            {/* <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
              Phone Number
            </th> */}
            {/* <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
              Time
            </th> */}
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
              Dhayi Name & Contact
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => {
            return (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="border border-gray-200 px-3 py-2 text-center">
                  {row.s_no}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.branch}
                </td>
                {/* <td className="border border-gray-200 px-3 py-2">{row.phone}</td>
            <td className="border border-gray-200 px-3 py-2">{row.time}</td> */}

                <td className="border border-gray-200 px-3 py-2">
                  <CustomSelectWithModal
                    value={row.dai_name_contact || "-"}
                    options={dayiNames.map((dayi) => dayi.name)}
                    onValueChange={(value) => handleChange(row.id, value)}
                    label={`${row.branch} — Choose Dhayi`}
                    disabledOptions={selectedOptions}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
