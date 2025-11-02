import { ISO } from "@/enum/iso";
import dayjs from "dayjs";

const formatDate = (date: string | Date, iso: ISO = ISO.DATE_TIME) => {
  return dayjs(date).format(iso);
};

export const Helper = {
    formatDate
}