import { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  type TextFieldProps,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

type Props = TextFieldProps;

const Input = (props: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = props.type === 'password';

  return (
    <TextField
      fullWidth
      {...props}
      type={isPassword && showPassword ? 'text' : props.type}
      InputProps={{
        ...props.InputProps,
        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </IconButton>
          </InputAdornment>
        ) : (
          props.InputProps?.endAdornment
        ),
      }}
    />
  );
};

export default Input;
