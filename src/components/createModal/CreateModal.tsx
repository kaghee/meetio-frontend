import type { Dayjs } from "dayjs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Controller, useForm } from "react-hook-form";
import { useCreateAppointmentMutation } from "../../services/appointment";
import { DateTimePicker } from "@mui/x-date-pickers";
import "./CreateModal.scss";
import { TextField } from "@mui/material";

interface CreateModalProps {
  close: () => void;
}

interface CreateFormData {
  title: string;
  description: string;
  start: Dayjs;
  end: Dayjs;
  attendees: number[];
}

const CreateModal: React.FC<CreateModalProps> = ({ close }) => {
  const [createAppointment] = useCreateAppointmentMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>();

  const onSubmit = (data: CreateFormData) => {
    console.log("creating, data", data);

    const payload = {
      title: data.title,
      description: data.description,
      start_time: data.start.toISOString(),
      end_time: data.end.toISOString(),
      attendee_ids: data.attendees,
    };
    createAppointment(payload);
    close();
  };

  return (
    <Dialog open={true} onClose={() => close()}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create Appointment</DialogTitle>
        <DialogContent className="create-modal">
          <div className="block-label">Details</div>
          <div className="details-block">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.title}
                  placeholder="Title"
                  className="title"
                  helperText={errors.title && "Title is required."}
                />
              )}
              rules={{ required: true }}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Description"
                  className="description"
                />
              )}
              rules={{ required: true }}
            />
          </div>
          <div className="block-label">Schedule</div>
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
          <div className="block-label">Attendees</div>
          <div className="attendees-block"></div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => close()}>Cancel</Button>
          <Button type={"submit"}>Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateModal;
