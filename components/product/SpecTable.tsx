import React from "react";
import { Prisma } from "@prisma/client";

interface SpecTableProps {
  specs: Prisma.JsonValue;
}

export default function SpecTable({ specs }: SpecTableProps) {
  if (!specs || typeof specs !== "object" || Array.isArray(specs) || Object.keys(specs).length === 0) {
    return <p className="text-muted-foreground text-sm italic">No technical specifications available.</p>;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden w-full">
      <table className="w-full text-sm text-left text-foreground">
        <tbody>
          {Object.entries(specs).map(([key, value], index) => {
            // Convert camelCase to Title Case (e.g., "formFactor" -> "Form Factor")
            const formattedKey = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());

            // Handle arrays (like features) or strings
            const displayValue = Array.isArray(value) 
              ? value.join(", ") 
              : String(value);

            return (
              <tr 
                key={key} 
                className={`border-b border-border last:border-0 ${index % 2 === 0 ? "bg-card" : "bg-secondary/50"}`}
              >
                <th scope="row" className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap w-1/3 border-r border-border">
                  {formattedKey}
                </th>
                <td className="px-4 py-3">
                  {displayValue}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
