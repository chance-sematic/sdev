import styled from "@emotion/styled";
import { useEffect, useMemo, useRef, useState } from "react";
import useCounter from "react-use/lib/useCounter";
import useLatest from "react-use/lib/useLatest";
import { Artifact as ArtifactType } from "src/Models";
import Headline from "src/component/Headline";
import MoreVertButton from "src/component/MoreVertButton";
import Section from "src/component/Section";
import ArtifactCoordinationContext, { ArtifactCoordinationState } from "src/context/artifactCoordinationContext";
import ArtifactMenu from "src/pages/RunDetails/contextMenus/ArtifactMenu";
import theme from "src/theme/new";
import { renderArtifactRow } from "src/typeViz/common";

const StyledSection = styled(Section)`
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;
    margin-right: -${theme.spacing(5)};
`;

const StyledVertButton = styled(MoreVertButton)`
    position: absolute;
    right: 0;
    top: 12px;
    transform: translate(50%,0);
`;

const ArtifactRepresentation = styled.div`
    margin-left: 0;
`;

interface ArtifactProps {
    name: string;
    artifact: ArtifactType;
    expanded?: boolean;
}

function Artifact(props: ArtifactProps) {
    const { name, artifact, expanded } = props;

    const { type_serialization, json_summary } = artifact;
    const [renderTimes, { inc }] = useCounter();
    const [coordinationState, setCoordinationState] = useState<ArtifactCoordinationState>(
        ArtifactCoordinationState.DIRTY);

    const contextValue = useMemo(() => ({
        coordinationState, setCoordinationState
    }), [coordinationState]);

    const contextMenuAnchor = useRef<HTMLButtonElement>(null);
    const latestAnchor = useLatest(contextMenuAnchor.current);

    useEffect(() => {
        // re-render until the context menu anchor is set
        if (latestAnchor.current === null) {
            inc();
        }
    }, [renderTimes, inc, latestAnchor]);

    return <ArtifactCoordinationContext.Provider value={contextValue}>
        <StyledSection>
            <Headline>Artifact</Headline>
            <StyledVertButton ref={contextMenuAnchor} />
            <ArtifactMenu anchorEl={latestAnchor.current} artifactId={artifact.id} />
        </StyledSection>
        <ArtifactRepresentation>
            {renderArtifactRow(name, type_serialization, json_summary, { expanded })}
        </ArtifactRepresentation>
    </ArtifactCoordinationContext.Provider>;
}

export default Artifact;
