import { useWatchContractEvent } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import { useState, useRef } from "react";
import { Log } from "viem";

export function useVoteStatusChange(onStatusChange: (newLogs: Log[]) => void) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [newLog, setNewLog] = useState<Log | null>(null);
  const processedLogsRef = useRef<Set<string>>(new Set());

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "WorkflowStatusChange",
    onLogs(newLogs) {
      console.log("WorkflowStatusChange event detected:", newLogs);

      if (newLogs && newLogs.length > 0) {
        const logId = `${newLogs[0].transactionHash}-${newLogs[0].logIndex}`;

        if (!processedLogsRef.current.has(logId)) {
          processedLogsRef.current.add(logId);
          setNewLog(newLogs[0]);
          setLogs((prev) => [...prev, ...newLogs]);

          if (onStatusChange && typeof onStatusChange === "function") {
            onStatusChange(newLogs);
          }
        }
      }
    },
  });

  const resetLogs = () => {
    setLogs([]);
    setNewLog(null);
    processedLogsRef.current.clear();
  };

  const clearNewLog = () => {
    setNewLog(null);
  };

  return {
    logs,
    newLog,
    resetLogs,
    clearNewLog,
  };
}
