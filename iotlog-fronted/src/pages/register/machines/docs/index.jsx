import { Button, Card, CardBody, CardHeader, CardFooter, Col, EvaIcon, Row } from "@paljs/ui";
import { Fetch, SpinnerFull, TextSpan, MachineHeader, AssetItemCard } from "../../../../components";
import BackButton from "../../../../components/Button/BackButton";
import { FormattedMessage, useIntl } from "react-intl";
import { useEffect, useState, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { getFields } from "./FieldsData";
import ContentItem from "../../../forms/Item";
import { useSearchParams } from "react-router-dom";
import ModalAssetDocument from "../../../../components/Archive/ModalAssetDocument";
import AssetFolderBreadcrumb from "../../../../components/Archive/AssetFolderBreadcrumb";
import ModalAssetFolder from "../../../../components/Archive/ModalAssetFolder";
import { toast } from "react-toastify";
import { connect } from "react-redux";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 20px;
  animation: ${fadeInUp} 0.3s ease-out;

  @media (min-width: 1920px) {
    grid-template-columns: repeat(7, 1fr);
  }

  @media (min-width: 1400px) and (max-width: 1919px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media (min-width: 1200px) and (max-width: 1399px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
  animation: ${fadeInUp} 0.3s ease-out;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.backgroundBasicColor2};
  border-radius: 12px;
  margin-top: 16px;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.theme.backgroundBasicColor3};
  border-radius: 8px;
  padding: 2px;
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.active ? props.theme.backgroundBasicColor1 : 'transparent'};
  color: ${props => props.active ? props.theme.colorPrimary500 : props.theme.colorBasic600};
  box-shadow: ${props => props.active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};

  &:hover {
    color: ${props => props.theme.colorPrimary500};
  }
`;

const ItemsCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: ${props => props.theme.backgroundBasicColor3};
  border-radius: 20px;
  font-size: 0.8rem;
  color: ${props => props.theme.colorBasic600};
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${props => props.variant === 'folder'
    ? 'rgba(255, 170, 0, 0.15)'
    : 'rgba(51, 102, 255, 0.15)'};
  color: ${props => props.variant === 'folder'
    ? props.theme.colorWarning500
    : props.theme.colorPrimary500};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  animation: ${fadeInUp} 0.4s ease-out;
`;

const EmptyIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  background: linear-gradient(135deg,
    ${props => props.theme.backgroundBasicColor2} 0%,
    ${props => props.theme.backgroundBasicColor3} 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: linear-gradient(135deg,
      ${props => props.theme.colorPrimary100} 0%,
      transparent 50%);
    z-index: -1;
  }
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colorBasic800};
`;

const EmptyDescription = styled.p`
  margin: 0 0 24px;
  font-size: 0.9rem;
  color: ${props => props.theme.colorBasic600};
  max-width: 400px;
  line-height: 1.5;
`;

const EmptyActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;

  input {
    padding-left: 40px !important;
    border-radius: 10px !important;
  }

  /* Esconder o label do campo de busca */
  label {
    display: none;
  }

  /* Ajustar margem do container do input */
  > div {
    margin: 0;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  bottom: 24px;
  color: ${props => props.theme.colorBasic500};
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
`;

function MachineDocs(props) {

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [docs, setDocs] = useState([]);
  const [allDocs, setAllDocs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState(null);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [machineInfo, setMachineInfo] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchParams] = useSearchParams();
  const intl = useIntl();

  const hasPermission = machineInfo?.enterprise?.id &&
    props.itemsByEnterprise?.some(
      (x) =>
        x.enterprise?.id === machineInfo.enterprise.id &&
        x.paths?.includes("/machine-docs")
    );

  const idAsset = searchParams.get("id");

  useEffect(() => {
    if (idAsset) {
      onGetUnifiedData(idAsset, currentFolderId);
      onGetMachineInfo(idAsset);
    }
  }, [idAsset, currentFolderId]);

  const onChange = (prop, value) => {
    setData(prev => ({ ...prev, [prop]: value }));
  }

  const fields = getFields({ intl });

  const onGetUnifiedData = (idAsset, idFolder = null) => {
    setIsLoading(true);
    const folderParam = idFolder === null ? "" : `&idFolder=${idFolder}`;
    Fetch.get(`/assetdocument/list-unified?idAsset=${idAsset}${folderParam}`)
      .then((res) => {
        if (res.data) {
          setFolders(res.data.folders || []);
          setAllDocs(res.data.documents || []);
          setDocs(res.data.documents || []);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }

  const onGetMachineInfo = (idAsset) => {
    Fetch.get(`/machine/info?id=${idAsset}`)
      .then((res) => {
        if (res.data) {
          setMachineInfo(res.data);
        }
      })
      .catch((err) => {
      });
  }

  const filteredDocs = useMemo(() => {
    if (!data.search || data.search.trim() === '') {
      return allDocs;
    }

    const searchTerm = data.search.toLowerCase().trim();
    return allDocs.filter(doc => {
      const fileName = doc.fileName?.toLowerCase() || '';
      const title = doc.title?.toLowerCase() || '';
      const description = doc.description?.toLowerCase() || '';

      return fileName.includes(searchTerm) ||
        title.includes(searchTerm) ||
        description.includes(searchTerm);
    });
  }, [allDocs, data.search]);

  const filteredFolders = useMemo(() => {
    if (!data.search || data.search.trim() === '') {
      return folders;
    }

    const searchTerm = data.search.toLowerCase().trim();
    return folders.filter(folder => {
      const name = folder.name?.toLowerCase() || '';
      const description = folder.description?.toLowerCase() || '';

      return name.includes(searchTerm) || description.includes(searchTerm);
    });
  }, [folders, data.search]);

  useEffect(() => {
    setDocs(filteredDocs);
  }, [filteredDocs]);

  const onNavigateToFolder = (folderId, folderName = null) => {
    if (folderId === null) {
      // Voltar para raiz
      setCurrentFolderId(null);
      setFolderPath([]);
    } else if (folderId === "back") {
      // Voltar para pasta pai
      const newPath = [...folderPath];
      newPath.pop();
      const parentFolderId = newPath.length > 0 ? newPath[newPath.length - 1].id : null;
      setCurrentFolderId(parentFolderId);
      setFolderPath(newPath);
    } else {
      // Navegar para pasta específica
      const existingIndex = folderPath.findIndex(f => f.id === folderId);
      if (existingIndex >= 0) {
        // Navegando para uma pasta no breadcrumb
        const newPath = folderPath.slice(0, existingIndex + 1);
        setFolderPath(newPath);
        setCurrentFolderId(folderId);
      } else {
        // Navegando para uma nova pasta
        const folder = folders.find(f => f.id === folderId);
        if (folder) {
          setFolderPath([...folderPath, { id: folderId, name: folder.name }]);
          setCurrentFolderId(folderId);
        }
      }
    }
  };

  const onCloseDocumentModal = (hasChanges = false) => {
    setShowDocumentModal(false);
    setDocumentToEdit(null);
    // Só atualiza se houve mudanças (criação ou edição)
    if (hasChanges) {
      onGetUnifiedData(idAsset, currentFolderId);
    }
  };

  const onCloseFolderModal = (hasChanges = false) => {
    setShowFolderModal(false);
    setFolderToEdit(null);
    // Só atualiza se houve mudanças (criação ou edição)
    if (hasChanges) {
      onGetUnifiedData(idAsset, currentFolderId);
    }
  };

  const onAddFolder = () => {
    // Verificar permissão antes de abrir o modal
    const hasPermission = machineInfo?.enterprise?.id &&
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === machineInfo.enterprise.id &&
          x.paths?.includes("/machine-docs")
      );

    if (!hasPermission) {
      toast.error(intl.formatMessage({ id: "access.denied" }));
      return;
    }

    setFolderToEdit(null);
    setShowFolderModal(true);
  };

  const onEditFolder = (folder) => {
    // Verificar permissão antes de abrir o modal de edição
    const hasPermission = machineInfo?.enterprise?.id &&
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === machineInfo.enterprise.id &&
          x.paths?.includes("/machine-docs")
      );

    if (!hasPermission) {
      toast.error(intl.formatMessage({ id: "access.denied" }));
      return;
    }

    setFolderToEdit(folder);
    setShowFolderModal(true);
  };

  const onDeleteFolder = async (folder) => {
    // Verificar permissão antes de deletar
    const hasPermission = machineInfo?.enterprise?.id &&
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === machineInfo.enterprise.id &&
          x.paths?.includes("/machine-docs")
      );

    if (!hasPermission) {
      toast.error(intl.formatMessage({ id: "access.denied" }));
      return;
    }

    setIsLoading(true);
    try {
      await Fetch.delete(`/assetdocument/folder/delete?id=${folder.id}`);
      toast.success(intl.formatMessage({ id: "folder.delete.successful" }));
      onGetUnifiedData(idAsset, currentFolderId);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "error.delete.folder";
      toast.error(intl.formatMessage({ id: errorMessage }));
      setIsLoading(false);
    }
  };

  const onAddDocument = () => {
    // Verificar permissão antes de abrir o modal
    const hasPermission = machineInfo?.enterprise?.id &&
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === machineInfo.enterprise.id &&
          x.paths?.includes("/machine-docs")
      );

    if (!hasPermission) {
      toast.error(intl.formatMessage({ id: "access.denied" }));
      return;
    }

    setDocumentToEdit(null);
    setShowDocumentModal(true);
  };

  const onEditDocument = (document) => {
    // Verificar permissão antes de abrir o modal de edição
    const hasPermission = machineInfo?.enterprise?.id &&
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === machineInfo.enterprise.id &&
          x.paths?.includes("/machine-docs")
      );

    if (!hasPermission) {
      toast.error(intl.formatMessage({ id: "access.denied" }));
      return;
    }

    setDocumentToEdit(document);
    setShowDocumentModal(true);
  };

  const onDeleteDocument = async (document) => {
    // Verificar permissão antes de deletar
    const hasPermission = machineInfo?.enterprise?.id &&
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === machineInfo.enterprise.id &&
          x.paths?.includes("/machine-docs")
      );

    if (!hasPermission) {
      toast.error(intl.formatMessage({ id: "access.denied" }));
      return;
    }

    setIsLoading(true);
    try {
      await Fetch.delete(`/assetdocument?id=${document.id}`);
      toast.success(intl.formatMessage({ id: "delete.success" }));
      onGetUnifiedData(idAsset, currentFolderId);
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.delete" }));
      setIsLoading(false);
    }
  };

  const totalItems = filteredFolders.length + docs.length;

  return (
    <>
      <Card>
        <CardHeader>
          <Col>
            <Row between="xs" middle="xs" className="mb-3">
              <TextSpan apparence="s1">
                <FormattedMessage id="documents" />
              </TextSpan>
            </Row>
            <Row between="xs" middle="xs">
              <MachineHeader idMachine={idAsset} />
            </Row>
          </Col>
        </CardHeader>
        <CardBody>
          {/* Breadcrumb de navegação */}
          <AssetFolderBreadcrumb
            folderPath={folderPath}
            onNavigate={onNavigateToFolder}
          />

          {/* Toolbar com busca, contadores e ações */}
          <Toolbar>
            <ToolbarLeft>
              {/* Campo de busca com ícone */}
              <SearchWrapper>
                <SearchIcon>
                  <EvaIcon name="search-outline" style={{ fontSize: '18px' }} />
                </SearchIcon>
                {fields.map((x, i) => (
                  <ContentItem
                    key={`${i}-${x.name}`}
                    data={data}
                    field={x}
                    onChange={onChange}
                  />
                ))}
              </SearchWrapper>

              {/* Contador de itens */}
              {!isLoading && totalItems > 0 && (
                <ItemsCounter>
                  {filteredFolders.length > 0 && (
                    <>
                      <EvaIcon name="folder-outline" style={{ fontSize: '14px' }} />
                      <CountBadge variant="folder">{filteredFolders.length}</CountBadge>
                    </>
                  )}
                  {docs.length > 0 && (
                    <>
                      <EvaIcon name="file-text-outline" style={{ fontSize: '14px' }} />
                      <CountBadge variant="document">{docs.length}</CountBadge>
                    </>
                  )}
                </ItemsCounter>
              )}
            </ToolbarLeft>

            <ToolbarRight>
              {/* Toggle de visualização */}
              <ViewToggle>
                <ViewButton
                  active={viewMode === 'grid'}
                  onClick={() => setViewMode('grid')}
                  title={intl.formatMessage({ id: "view.grid" })}
                >
                  <EvaIcon name="grid-outline" style={{ fontSize: '18px' }} />
                </ViewButton>
                <ViewButton
                  active={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                  title={intl.formatMessage({ id: "view.list" })}
                >
                  <EvaIcon name="list-outline" style={{ fontSize: '18px' }} />
                </ViewButton>
              </ViewToggle>

              {/* Botões de ação */}
              {!isLoading && hasPermission && (
                <>
                  <ActionButton
                    size="Small"
                    status="Basic"
                    appearance="outline"
                    disabled={isLoading}
                    onClick={onAddFolder}
                  >
                    <EvaIcon name="folder-add-outline" style={{ fontSize: '18px' }} />
                    <FormattedMessage id="add.folder" />
                  </ActionButton>
                  <ActionButton
                    size="Small"
                    status="Primary"
                    disabled={isLoading}
                    onClick={onAddDocument}
                  >
                    <EvaIcon name="file-add-outline" style={{ fontSize: '18px' }} />
                    <FormattedMessage id="add.document" />
                  </ActionButton>
                </>
              )}
            </ToolbarRight>
          </Toolbar>

          {/* Lista unificada de pastas e documentos */}
          {(filteredFolders.length > 0 || docs.length > 0) && (
            viewMode === 'grid' ? (
              <GridContainer>
                {/* Pastas primeiro */}
                {filteredFolders.map((folder, index) => (
                  <AssetItemCard
                    key={`folder-${folder.id || index}`}
                    item={folder}
                    type="folder"
                    viewMode={viewMode}
                    onOpen={() => onNavigateToFolder(folder.id, folder.name)}
                    onDelete={onDeleteFolder}
                    onEdit={onEditFolder}
                  />
                ))}

                {/* Documentos depois */}
                {docs.map((doc, index) => (
                  <AssetItemCard
                    key={`doc-${doc.id || index}`}
                    item={doc}
                    type="document"
                    viewMode={viewMode}
                    onOpen={null}
                    onDelete={onDeleteDocument}
                    onEdit={onEditDocument}
                  />
                ))}
              </GridContainer>
            ) : (
              <ListContainer>
                {/* Pastas primeiro */}
                {filteredFolders.map((folder, index) => (
                  <AssetItemCard
                    key={`folder-${folder.id || index}`}
                    item={folder}
                    type="folder"
                    viewMode={viewMode}
                    onOpen={() => onNavigateToFolder(folder.id, folder.name)}
                    onDelete={onDeleteFolder}
                    onEdit={onEditFolder}
                  />
                ))}

                {/* Documentos depois */}
                {docs.map((doc, index) => (
                  <AssetItemCard
                    key={`doc-${doc.id || index}`}
                    item={doc}
                    type="document"
                    viewMode={viewMode}
                    onOpen={null}
                    onDelete={onDeleteDocument}
                    onEdit={onEditDocument}
                  />
                ))}
              </ListContainer>
            )
          )}

          {/* Estado vazio quando não há documentos nem pastas */}
          {docs.length === 0 && filteredFolders.length === 0 && !isLoading && (
            <EmptyState>
              <EmptyIcon>
                <EvaIcon
                  name={data.search ? "search-outline" : "folder-outline"}
                  style={{ fontSize: '48px', color: 'inherit' }}
                  status="Basic"
                />
              </EmptyIcon>
              <EmptyTitle>
                <FormattedMessage id={data.search ? "search.no.results" : "folder.empty.title"} />
              </EmptyTitle>
              <EmptyDescription>
                <FormattedMessage id={data.search ? "search.no.results.description" : "folder.empty.description"} />
              </EmptyDescription>
              {!data.search && hasPermission && (
                <EmptyActions>
                  <ActionButton
                    size="Small"
                    status="Basic"
                    appearance="outline"
                    onClick={onAddFolder}
                  >
                    <EvaIcon name="folder-add-outline" style={{ fontSize: '18px' }} />
                    <FormattedMessage id="add.folder" />
                  </ActionButton>
                  <ActionButton
                    size="Small"
                    status="Primary"
                    onClick={onAddDocument}
                  >
                    <EvaIcon name="file-add-outline" style={{ fontSize: '18px' }} />
                    <FormattedMessage id="add.document" />
                  </ActionButton>
                </EmptyActions>
              )}
            </EmptyState>
          )}

          {/* Modal de Documento */}
          <ModalAssetDocument
            show={showDocumentModal}
            setIsLoading={setIsLoading}
            onClose={onCloseDocumentModal}
            idAsset={idAsset}
            documentToEdit={documentToEdit}
            currentFolderId={currentFolderId}
            itemsByEnterprise={props.itemsByEnterprise}
            enterpriseId={machineInfo?.enterprise?.id}
          />

          {/* Modal de Pasta */}
          <ModalAssetFolder
            show={showFolderModal}
            setIsLoading={setIsLoading}
            onClose={onCloseFolderModal}
            idAsset={idAsset}
            folderToEdit={folderToEdit}
            parentFolderId={currentFolderId}
          />
        </CardBody>
        <CardFooter>
          <BackButton />
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}

const mapStateToProps = (state) => ({
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(MachineDocs);
