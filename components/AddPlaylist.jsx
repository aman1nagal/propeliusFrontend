import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  useAddPlaylistMutation,
  useUpdatePlaylistMutation,
} from "../redux/slices/rtkSlices/playlistSlice";
import Loader from "../components/Loader";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "20px",
  p: 4,
};

const AddPlaylist = ({ handleClose, open, data = null, refetch }) => {
  console.log(data?._id, "data");

  const [addNewPlaylist, { isLoading: isAdding, error: addError }] =
    useAddPlaylistMutation();
  const [
    updateExistingPlaylist,
    { isLoading: isUpdating, error: updateError },
  ] = useUpdatePlaylistMutation();

  const playlistValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values) => {
    console.log(values);
    if (data == null) {
      await addNewPlaylist({
        name: values.name,
        description: values.description,
      }).unwrap();
    } else {
      await updateExistingPlaylist({
        id: data?._id,
        body: { name: values.name, description: values.description },
      }).unwrap();
    }
    refetch();
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ borderRadius: "10px", width: "100% !important" }}
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          className="font-[500]"
        >
          {data == null ? "Add" : "Edit"} Playlist
        </Typography>
        <Formik
          initialValues={{
            name: data?.name || "",
            description: data?.description || "",
          }}
          validationSchema={playlistValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, values, errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                id="name"
                name="name"
                label="Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
              <div className="flex justify-center mt-5">
                <Button
                  type="submit"
                  sx={{
                    background: "linear-gradient(45deg, #B5179E, #7209B7)",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "999px",
                    padding: "10px 20px",
                  }}
                >
                  {isAdding || isUpdating ? (
                    <Loader size={20} color="white" />
                  ) : data == null ? (
                    "Add Playlist"
                  ) : (
                    "Edit Playlist"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddPlaylist;
