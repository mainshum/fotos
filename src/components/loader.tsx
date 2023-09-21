import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="center-absolute">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
