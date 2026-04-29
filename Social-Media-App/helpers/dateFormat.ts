import moment from "moment";

export const getFormattedDate = (date: string | Date | undefined): string => {
  if (!date) return "";

  const now = moment();
  const postDate = moment(date);

  const diffInMinutes = now.diff(postDate, "minutes");
  const diffInHours = now.diff(postDate, "hours");
  const diffInDays = now.diff(postDate, "days");

  if (diffInMinutes < 1) return "Vừa xong";
  if (diffInMinutes < 60) return `${diffInMinutes} phút`;
  if (diffInHours < 24) return `${diffInHours} giờ`;
  if (diffInDays < 7) return `${diffInDays} ngày`;
  return postDate.format("D [thg] M");
};
