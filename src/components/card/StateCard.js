import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function StateCard(props) {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          State:{props.state}
        </Typography>
        <Typography variant="body2">
            Confirmed:{props.confirmed}
        </Typography>
        <Typography variant="body2">
            Deaths:{props.deaths}
        </Typography>
        <Typography variant="body2">
            Recovered: {props.recovered}
        </Typography>
      </CardContent>
    </Card>
  );
}
