import { useState } from "react";
import { Severity } from "./MapComponent";

interface AddHolePopupProps {
    x: number;
    y: number;
    onClose: () => void;
    acceptNewHoleFunc: () => void;
}

const AddHolePopup = ({ x, y, onClose, acceptNewHoleFunc }: AddHolePopupProps) => {
    const [severity, setSeverity] = useState<Severity>(Severity.Low);
    const [description, setDescription] = useState("");

    return (
        <div
            className="absolute p-4 bg-white border border-black rounded-lg shadow-md z-50"
            style={{
                top: y,
                left: x,
                transform: "translate(-50%, -100%)", // center above the click point
            }}
        >
            <h3 className="text-lg font-semibold mb-2">Add New Hole</h3>
            
            <label className="block mb-2">
                <span className="font-medium">Severity:</span>
                <select
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value) as Severity)}
                    className="block w-full mt-1 border rounded p-2"
                >
                    <option value={Severity.Low}>Low</option>
                    <option value={Severity.Medium}>Medium</option>
                    <option value={Severity.High}>High</option>
                </select>
            </label>
            
            <label className="block mb-2">
                <span className="font-medium">Description:</span>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-1 border rounded p-2"
                />
            </label>
            
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => {
                        acceptNewHoleFunc();
                        onClose();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add
                </button>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default AddHolePopup;
