import { FaFileCsv, FaFilePdf } from "react-icons/fa";

import { exportCSV } from "../../utils/exportCSV";
import { exportPDF } from "../../utils/exportPDF";

const ExportButtons = ({ expenses }) => {

    return (

        <div className="flex gap-3">

            <button

                onClick={() => exportCSV(expenses)}

                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition"

            >

                <FaFileCsv />

                Export CSV

            </button>

            <button

                onClick={() => exportPDF(expenses)}

                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition"

            >

                <FaFilePdf />

                Export PDF

            </button>

        </div>

    );

};

export default ExportButtons;