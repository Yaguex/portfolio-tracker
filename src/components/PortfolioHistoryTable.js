import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { format, parse, startOfYear } from "date-fns";
import { Card } from "@/components/ui/card";
import { Table, TableBody, } from "@/components/ui/table";
import { EditValueModal } from "./EditValueModal";
import { PortfolioTableRow } from "./PortfolioTableRow";
import { PortfolioTableHeader } from "./PortfolioTableHeader";
import { useState } from "react";
export function PortfolioHistoryTable({ data }) {
    const [editingRow, setEditingRow] = useState(null);
    const sortedData = [...data].sort((a, b) => b.date.localeCompare(a.date));
    const calculateMoMChange = (currentValue, previousValue) => {
        const gain = currentValue - previousValue;
        const returnPercentage = (gain / previousValue) * 100;
        return { gain, returnPercentage };
    };
    const calculateYTDChange = (currentValue, startOfYearValue) => {
        const gain = currentValue - startOfYearValue;
        const returnPercentage = (gain / startOfYearValue) * 100;
        return { gain, returnPercentage };
    };
    const getStartOfYearValue = (date) => {
        const currentYear = parse(date, "yyyy-MM", new Date()).getFullYear();
        const startOfYearDate = startOfYear(new Date(currentYear, 0)).toISOString().slice(0, 7);
        const startOfYearDataEntry = data.find(entry => entry.date === startOfYearDate);
        return startOfYearDataEntry?.value ?? data[data.length - 1].value;
    };
    const formattedData = sortedData.map((entry, index) => {
        const artificialMultiplier = index % 3 === 0 ? -1 : 1;
        const previousMonth = sortedData[index + 1]?.value ?? entry.value;
        const startOfYearValue = getStartOfYearValue(entry.date);
        const momChanges = calculateMoMChange(entry.value, previousMonth);
        const ytdChanges = calculateYTDChange(entry.value, startOfYearValue);
        // Sample net flow data for specific months
        let netFlow = 0;
        if (entry.date === '2024-10')
            netFlow = 20000;
        if (entry.date === '2024-08')
            netFlow = -15000;
        return {
            type: "regular",
            date: entry.date,
            value: entry.value,
            netFlow,
            formattedDate: format(parse(entry.date, "yyyy-MM", new Date()), "MMM yyyy"),
            formattedValue: (entry.value < 0 ? "-$" : "$") + Math.abs(entry.value).toLocaleString(),
            formattedNetFlow: netFlow === 0 ? "$0" : (netFlow < 0 ? "-$" : "+$") + Math.abs(netFlow).toLocaleString(),
            momGain: momChanges.gain * artificialMultiplier,
            momReturn: momChanges.returnPercentage * artificialMultiplier,
            ytdGain: ytdChanges.gain * artificialMultiplier,
            ytdReturn: ytdChanges.returnPercentage * artificialMultiplier,
        };
    });
    const handleEdit = (row) => {
        setEditingRow(row);
    };
    const handleSave = (newValue, newNetFlow) => {
        console.log("Saving new value:", newValue, "and net flow:", newNetFlow, "for row:", editingRow);
        setEditingRow(null);
    };
    const formatGain = (value) => value < 0 ? `-$${Math.abs(value).toLocaleString()}` : `$${Math.abs(value).toLocaleString()}`;
    const formatReturn = (value) => `${value >= 0 ? "+" : "-"}${Math.abs(value).toFixed(2)}%`;
    const getValueColor = (value) => value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "";
    return (_jsxs(_Fragment, { children: [_jsx(Card, { className: "card-gradient", children: _jsxs(Table, { children: [_jsx(PortfolioTableHeader, {}), _jsx(TableBody, { children: formattedData.map((row, index) => {
                                const isYearChange = index < formattedData.length - 1 &&
                                    parse(row.date, "yyyy-MM", new Date()).getFullYear() !==
                                        parse(formattedData[index + 1].date, "yyyy-MM", new Date()).getFullYear();
                                return (_jsx(PortfolioTableRow, { row: row, formatGain: formatGain, formatReturn: formatReturn, getValueColor: getValueColor, onEdit: () => handleEdit(row), isYearChange: isYearChange }, row.date));
                            }) })] }) }), editingRow && (_jsx(EditValueModal, { isOpen: true, onClose: () => setEditingRow(null), onSave: handleSave, initialValue: editingRow.value, initialNetFlow: editingRow.netFlow }))] }));
}
