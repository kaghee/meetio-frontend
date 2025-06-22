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
import {
  useGetDepartmentsQuery,
  useGetEmployeesByIdQuery,
} from "../../services/department";
import { useEffect, useState } from "react";
import { useUpdateAppointmentMutation } from "../../services/appointment";

interface DetailPanelProps {
  isOpen: boolean;
  close: () => void;
  meeting: MeetingData | undefined;
}

interface FormData {
  start: Dayjs;
  end: Dayjs;
  department: string;
  attendees: number[];
}

const DetailPanel: React.FC<DetailPanelProps> = ({
  isOpen,
  close,
  meeting,
}) => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>();
  const [updateAppointment] = useUpdateAppointmentMutation();
  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      start: meeting ? dayjs(meeting.start_time) : undefined,
      end: meeting ? dayjs(meeting.end_time) : undefined,
      department: "",
      attendees: meeting?.attendees.map((att) => att.id) || [],
    },
  });

  const departmentValue = watch("department");

  const { data: departments } = useGetDepartmentsQuery({});
  const { data: employees } = useGetEmployeesByIdQuery(selectedDepartmentId!, {
    skip: selectedDepartmentId === undefined,
  });

  useEffect(() => {
    if (departmentValue !== "") {
      setSelectedDepartmentId(parseInt(departmentValue));
    }
  }, [departmentValue]);

  const onSubmit = (data: FormData) => {
    if (!meeting) return;

    const payload = {
      id: meeting.id,
      start_time: data.start.toISOString(),
      end_time: data.end.toISOString(),
      department: data.department,
      attendee_ids: data.attendees,
    };
    updateAppointment(payload);
  };

  return (
    <Dialog className="dialog" open={isOpen} onClose={() => close()}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                      onChange={(e) =>
                        setSelectedDepartmentId(
                          departments?.find(
                            (dpt) => dpt.name === e.target.value,
                          )?.id,
                        )
                      }
                    >
                      <MenuItem disabled value="">
                        <em>Select a department</em>
                      </MenuItem>
                      {(departments || []).map((dpt) => (
                        <MenuItem value={dpt.name}>{dpt.name}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <div className="employees">
                  {employees?.map((employee) => (
                    <div className="employee" key={employee.id}>
                      <span>{employee.name}</span>
                      <Controller
                        name="attendees"
                        control={control}
                        render={({ field }) => {
                          const isChecked =
                            employee.id !== undefined &&
                            field.value.includes(employee.id);

                          return (
                            <Checkbox
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  // Remove id from attendees formData
                                  field.onChange(
                                    field.value.filter(
                                      (id) => id !== employee.id,
                                    ),
                                  );
                                } else {
                                  // Add employee.id to formData
                                  field.onChange([...field.value, employee.id]);
                                }
                              }}
                            />
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </>
        ) : null}
        <DialogActions>
          <Button disabled={!meeting} type={"submit"}>
            Save
          </Button>
          <Button disabled={!meeting}>Delete</Button>
          <Button onClick={() => close()}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DetailPanel;
