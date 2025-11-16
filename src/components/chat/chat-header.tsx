"use client";

import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";

/* componnents */
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme";
import {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorLogo,
  ModelSelectorName,
} from "@/components/ai-elements/model-selector";

const MODELS = [
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
  },
];

interface ChatHeaderProps {
  onNewChat: () => void;
  initialModel?: string;
}

export function ChatHeader({ onNewChat, initialModel }: ChatHeaderProps) {
  const [selectedModel, setSelectedModel] = useState(
    MODELS.find((m) => m.id === initialModel) || MODELS[0],
  );
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      {/* new chat */}
      <Button
        variant="outline"
        size="icon"
        onClick={onNewChat}
        className="cursor-pointer rounded-full"
      >
        <Plus className="size-4" />
      </Button>

      <div className="flex items-center gap-2">
        {/* model selector */}
        <ModelSelector
          open={modelSelectorOpen}
          onOpenChange={setModelSelectorOpen}
        >
          <ModelSelectorTrigger asChild>
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <ChevronDown className="size-4 mr-2" />
              <span className="text-sm">{selectedModel.name}</span>
            </Button>
          </ModelSelectorTrigger>
          <ModelSelectorContent>
            <ModelSelectorInput placeholder="Search models..." />
            <ModelSelectorList>
              <ModelSelectorGroup heading="Available Models">
                {MODELS.map((model) => (
                  <ModelSelectorItem
                    key={model.id}
                    value={model.id}
                    onSelect={() => {
                      setSelectedModel(model);
                      setModelSelectorOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <ModelSelectorLogo provider={model.provider} />
                    <ModelSelectorName>{model.name}</ModelSelectorName>
                  </ModelSelectorItem>
                ))}
              </ModelSelectorGroup>
            </ModelSelectorList>
          </ModelSelectorContent>
        </ModelSelector>

        {/* theme toggle */}
        <ThemeToggle />
      </div>
    </div>
  );
}
