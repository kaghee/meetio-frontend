import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { DateTimePicker } from "@mui/x-date-pickers";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { MeetingData } from "../meeting/Meeting";
import type { Dayjs } from "dayjs";
import "./DetailPanel.scss";
import { Checkbox } from "@mui/material";
import dayjs from "dayjs";

interface DetailPanelProps {
  isOpen: boolean;
  close: () => void;
  meeting: MeetingData | undefined;
}

interface Attendee {
  id: number;
  name: string;
}

interface FormData {
  start: Dayjs;
  end: Dayjs;
  department: string;
  attendees: Attendee[];
}

const DetailPanel: React.FC<DetailPanelProps> = ({
  isOpen,
  close,
  meeting,
}) => {
  console.log("meeting", meeting?.start_time);

  const { control } = useForm<FormData>({
    defaultValues: {
      start: meeting ? dayjs(meeting.start_time) : undefined,
      end: meeting ? dayjs(meeting.end_time) : undefined,
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
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    className="start"
                    format="YYYY-MM-DD HH:mm"
                  />
                )}
              />
              <Controller
                name="end"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    className="end"
                    format="YYYY-MM-DD HH:mm"
                  />
                )}
              />
            </div>
            <hr />
            <div className="attendees-block">
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    className="department"
                    renderValue={(selected) => {
                      if (selected?.length === 0) {
                        return <em>Select a department</em>;
                      }

                      return selected;
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select a department</em>
                    </MenuItem>
                    <MenuItem value={"Sales"}>Sales</MenuItem>
                  </Select>
                )}
              />
              <div className="attendees">
                {["Roronoa Zoro", "Vinsmoke Sanji", "Jinbe"].map((attendee) => (
                  <div className="attendee">
                    <span>{attendee}</span>
                    <Checkbox />
                  </div>
                ))}
              </div>
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
