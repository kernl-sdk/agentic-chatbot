"use client";

import { Plus, SlidersVertical, History } from "lucide-react";

import type { AgentResource } from "@/lib/kernl/types";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatHeaderProps {
  agentId: string;
  agents?: AgentResource[];
  onAgentChange: (agentId: string) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
}

export function ChatHeader({
  agentId,
  agents,
  onAgentChange,
  onNewChat,
  onOpenSettings,
  onOpenHistory,
}: ChatHeaderProps) {
  const currentAgent = agents?.find((a) => a.id === agentId);

  return (
    <header className="flex items-center justify-between px-7 py-5">
      <Select value={agentId} onValueChange={onAgentChange}>
        <SelectTrigger className="w-[180px] border-none bg-transparent shadow-none">
          <SelectValue placeholder="Select agent">
            {currentAgent?.name ?? agentId}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {agents?.map((agent) => (
            <SelectItem key={agent.id} value={agent.id}>
              {agent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenSettings}
              className="rounded-full"
            >
              <SlidersVertical className="size-4.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2">
            Settings <Kbd className="h-4 min-w-4 text-[10px]">S</Kbd>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenHistory}
              className="rounded-full"
            >
              <History className="size-4.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2">
            History <Kbd className="h-4 min-w-4 text-[10px]">H</Kbd>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewChat}
              className="ml-1.5 cursor-pointer rounded-full border"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2">
            New chat <Kbd className="h-4 min-w-4 text-[10px]">⌘J</Kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
