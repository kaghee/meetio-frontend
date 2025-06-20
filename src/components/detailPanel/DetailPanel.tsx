import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { MeetingData } from "../meeting/Meeting";
import type { Dayjs } from "dayjs";
import "./DetailPanel.scss";

interface DetailPanelProps {
  isOpen: boolean;
  close: () => void;
  meeting: MeetingData | undefined;
}

interface FormData {
  start: Dayjs;
  end: Dayjs;
  department: string;
  attendees: string[];
}

const DetailPanel: React.FC<DetailPanelProps> = ({
  isOpen,
  close,
  meeting,
}) => {
  const { control } = useForm<FormData>({
    defaultValues: {
      start: undefined,
      end: undefined,
      department: "",
      attendees: [],
    },
  });

  return (
    <Dialog className="dialog" open={isOpen} onClose={() => close()}>
      {meeting ? (
        <>
          <DialogTitle>{meeting.title}</DialogTitle>
          <DialogContent>
            <div className="time-block">
              <Controller
                name="start"
                control={control}
                render={({ field }) => <DatePicker {...field} />}
              />
              <Controller
                name="end"
                control={control}
                render={({ field }) => <DatePicker {...field} />}
              />
            </div>
            <div className="attendees-block">
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    <MenuItem disabled value="">
                      <em>Placeholder</em>
                    </MenuItem>
                    <MenuItem value={"sales"}>Sales</MenuItem>
                  </Select>
                )}
              />
              {/* {meeting.attendees ? (
              {meeting.attendees.map((attendee) => (
                <Checkbox/>
              ))}
            )} */}
            </div>
          </DialogContent>
        </>
      ) : null}
      <DialogActions>
        <Button disabled={!meeting}>Save</Button>
        <Button disabled={!meeting}>Delete</Button>
        <Button onClick={() => close()}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailPanel;
