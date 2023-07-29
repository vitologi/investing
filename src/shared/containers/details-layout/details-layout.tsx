import {Link, styled} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ArrowBackIos as ArrowBackIosIcon} from "@mui/icons-material";
import {useIntlStore} from "../../../modules/intl/store/intl.selector";
import {PropsWithChildren} from "react";
import {FormattedMessage} from "react-intl";

const Header = styled("div")(({theme}) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1, 2),
}));

interface IProps {
  actionTitle?: string;
  isActionDisabled: boolean;
}

export const DetailsLayout = (props: PropsWithChildren<IProps>): JSX.Element => {
  const {actionTitle = "app.common.actions.save", isActionDisabled = true, children} = props;
  const navigate = useNavigate();
  const intlStore = useIntlStore();

  return (<>
      <Header>
        <ArrowBackIosIcon
          sx={{fontSize: 16, cursor: 'pointer'}}
          aria-label={intlStore.formatMessage("app.common.actions.back")}
          onClick={() => navigate('..')}
        />
        <Link
          component="button"
          type="submit"
          disabled={isActionDisabled}
          underline="none"
          color={(theme) => theme.palette.text[isActionDisabled ? 'disabled' : 'primary']}
          fontWeight={'bold'} // TODO: handle cursor pointer on disable state
        >
          <FormattedMessage id={actionTitle}/>
        </Link>
      </Header>

      {children}
    </>
  );
}
