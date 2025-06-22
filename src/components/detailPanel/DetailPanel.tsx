import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Checkbox } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
  useGetDepartmentsQuery,
  useGetEmployeesByIdQuery,
} from "../../services/department";
import {
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} from "../../services/appointment";
import type { MeetingData } from "../meeting/Meeting";
import type { Employee } from "../../types";
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
  attendees: number[];
}

const DetailPanel: React.FC<DetailPanelProps> = ({
  isOpen,
  close,
  meeting,
}) => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>();
  const [employeesToDisplay, setEmployeesToDisplay] = useState<
    Partial<Employee>[]
  >([]);
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();

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
  const { data: departmentEmployees } = useGetEmployeesByIdQuery(
    selectedDepartmentId!,
    {
      skip: selectedDepartmentId === undefined,
    },
  );

  useEffect(() => {
    if (departmentValue !== "") {
      setSelectedDepartmentId(parseInt(departmentValue));
    }
  }, [departmentValue]);

  /* Initially displays all participants of the selected meeting.
  Upon department selection, displays employees of the department. */
  useEffect(() => {
    if (!meeting) return;
    if (!meeting.attendees && !departmentEmployees) return;

    const itemsToDisplay: Partial<Employee>[] = (
      departmentEmployees ?? meeting.attendees
    ).map((emp) => ({
      id: emp.id,
      name: emp.name,
    }));
    setEmployeesToDisplay(itemsToDisplay);
  }, [departmentEmployees, meeting, meeting?.attendees]);

  const deleteMeeting = () => {
    if (!meeting) return;
    deleteAppointment(meeting.id);
    close();
  };

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
    close();
  };

  const renderAttendees = () => {
    return employeesToDisplay?.map((employee) => (
      <div className="attendee" key={employee.id}>
        <span>{employee.name}</span>
        <Controller
          name="attendees"
          control={control}
          render={({ field }) => {
            const isChecked =
              employee.id !== undefined && field.value.includes(employee.id);

            return (
              <Checkbox
                checked={isChecked}
                onChange={() => {
                  if (isChecked) {
                    // Remove id from attendees formData
                    field.onChange(
                      field.value.filter((id) => id !== employee.id),
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
    ));
  };

  return (
    <Dialog className="dialog" open={isOpen} onClose={() => close()}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {meeting && (
          <>
            <DialogTitle>
              {meeting.title}
              <div className="description">{meeting.description}</div>
            </DialogTitle>
            <DialogContent>
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
              <hr />
              <div className="block-label">Attendees</div>
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
                <div className="attendees">{renderAttendees()}</div>
              </div>
            </DialogContent>
          </>
        )}
        <DialogActions>
          <Button disabled={!meeting} type={"submit"}>
            Save
          </Button>
          <Button disabled={!meeting} onClick={deleteMeeting}>
            Delete
          </Button>
          <Button onClick={() => close()}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DetailPanel;
