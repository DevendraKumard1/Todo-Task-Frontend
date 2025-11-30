import moment from "moment";

export const ucFirst = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const dateFormat = (date) => {
  if (!date) return "";
  return moment(date).format("DD MMM YYYY");
};

export function statusBadge(status) {
  if (!status) return null;

  const st = status.toLowerCase();

  let className = "";
  let label = ucFirst(st);

  switch (st) {
    case "active":
    case "high":
      className = "badge badge-danger";
      break;
    case "medium":
      className = "badge badge-primary";
      break;
    case "low":
      className = "badge badge-secondary";
      break;
    case "pending":
      className = "badge badge-warning";
      break;
    case "in_progress":
      className = "badge badge-primary";
      break;
    case "hold":
      className = "badge badge-info";
      break;
    case "completed":
      className = "badge badge-success";
      break;
    case "revoked":
      className = "badge badge-danger";
      break;
    default:
      className = "badge badge-gray";
      break;
  }

  return <span className={className}>{label}</span>;
}