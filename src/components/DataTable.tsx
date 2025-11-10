import { TableRow, DhayiName } from "../types";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "../components/ui/select";
import TNTJTHANJAIHEADING from "./assets/img/TNTJTHANJAIHEADING.jpg";

interface DataTableProps {
  data: TableRow[];
  dayiNames: DhayiName[];
  onChange: (data: TableRow[]) => void;
  onDelete: (id: string) => void;
}

export const DataTable = ({ data, dayiNames, onChange }: DataTableProps) => {
  const handleChange = (id: string, value: string) => {
    const updated = data.map((row) =>
      row.id === id ? { ...row, dai_name_contact: value } : row
    );
    onChange(updated);
  };

  const selectedDayis = data.map((row) => row.dai_name_contact).filter(Boolean);

  return (
    <div className="w-full overflow-x-auto border rounded-md shadow-md bg-white">
      <table className="w-full border-collapse text-sm sm:text-base">
        <thead>
          {/* Header Image Row */}
          <tr>
            <td colSpan={5} className="p-0">
              <img
                src={TNTJTHANJAIHEADING}
                alt="TNTJ Thanjai Heading"
                className="w-full h-auto object-cover"
              />
            </td>
          </tr>

          {/* Column Headers */}
          <tr className="bg-gray-100 text-gray-800">
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
              S.No
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
              Branch Name / கிளை பெயர்
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
              Phone Number
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
              Time
            </th>
            <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
              Dhayi Name & Contact
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="border border-gray-200 px-3 py-2 text-center">
                {row.s_no}
              </td>
              <td className="border border-gray-200 px-3 py-2">{row.branch}</td>
              <td className="border border-gray-200 px-3 py-2">{row.phone}</td>
              <td className="border border-gray-200 px-3 py-2">{row.time}</td>

              <td className="border border-gray-200 px-3 py-2">
                <Select
                  value={row.dai_name_contact || ""}
                  onValueChange={(value) => handleChange(row.id, value)}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select Dhayi" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{row.branch} — Choose Dhayi</SelectLabel>
                      <SelectItem value="-">Nil</SelectItem>
                      {dayiNames.map((dayi) => (
                        <SelectItem
                          key={dayi.id}
                          value={dayi.name}
                          disabled={
                            selectedDayis.includes(dayi.name) &&
                            row.dai_name_contact !== dayi.name
                          }
                        >
                          {dayi.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
