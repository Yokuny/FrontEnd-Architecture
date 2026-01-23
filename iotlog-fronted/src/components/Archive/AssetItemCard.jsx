import React, { useState, useRef, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import TextSpan from "../Text/TextSpan";
import Col from "@paljs/ui/Col";
import styled, { keyframes } from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import { formatterMbKb } from "../Utils";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui";
import DeleteConfirmationPopover from "./DeleteConfirmationPopover";
import { Fetch } from "../index";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const StyledCard = styled(Card)`
  position: relative;
  height: 100%;
  min-height: 200px;
  transition: all 0.25s ease;
  border: 1px solid ${props => props.theme.borderBasicColor3};
  animation: ${fadeIn} 0.3s ease-out;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: ${props => props.theme.colorPrimary400};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.isFolder
    ? `linear-gradient(90deg, ${props.theme.colorWarning500}, ${props.theme.colorWarning400})`
    : `linear-gradient(90deg, ${props.theme.colorPrimary500}, ${props.theme.colorPrimary400})`};
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ColFlex = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 100%;
  padding: 8px 0;
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: all 0.25s ease;
  background: ${props => props.isFolder
    ? `linear-gradient(135deg, rgba(255, 170, 0, 0.1) 0%, rgba(255, 170, 0, 0.05) 100%)`
    : props.iconBg || `linear-gradient(135deg, rgba(51, 102, 255, 0.1) 0%, rgba(51, 102, 255, 0.05) 100%)`};

  ${StyledCard}:hover & {
    transform: scale(1.1);
  }
`;

const ItemIcon = styled(EvaIcon)`
  font-size: 32px;
`;

const PermissionBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 500;
  background: ${props => {
    switch (props.visibility) {
      case 'public': return 'rgba(0, 214, 143, 0.15)';
      case 'private': return 'rgba(255, 170, 0, 0.15)';
      case 'limited': return 'rgba(51, 102, 255, 0.15)';
      default: return 'transparent';
    }
  }};
  color: ${props => {
    switch (props.visibility) {
      case 'public': return props.theme.colorSuccess500;
      case 'private': return props.theme.colorWarning500;
      case 'limited': return props.theme.colorInfo500;
      default: return 'inherit';
    }
  }};
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 36px;
  right: 8px;
  background: ${(props) => props.theme.backgroundBasicColor1};
  border: 1px solid ${(props) => props.theme.borderBasicColor3};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 120px;
  overflow: hidden;
`;

const MenuItem = styled.div`
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease;
  font-size: 0.85rem;

  &:hover {
    background: ${(props) => props.theme.backgroundBasicColor2};
  }

  &.danger:hover {
    background: rgba(255, 61, 113, 0.08);
  }
`;

const FileName = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.3;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 0.75rem;
  color: ${props => props.theme.colorBasic600};
`;

const FileExtension = styled.span`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => props.bg || 'rgba(130, 87, 229, 0.15)'};
  color: ${props => props.color || '#8257e5'};
`;

const Description = styled.div`
  text-align: center;
  font-size: 0.75rem;
  color: ${props => props.theme.colorBasic600};
  margin-top: 6px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
  justify-content: center;
`;

const Tag = styled.span`
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(130, 87, 229, 0.12);
  color: #8257e5;
`;

const ItemCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  background: ${props => props.theme.backgroundBasicColor3};
  color: ${props => props.theme.colorBasic600};
`;

const ExpirationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  background: ${props => props.expired
    ? 'rgba(255, 61, 113, 0.12)'
    : props.expiringSoon
      ? 'rgba(255, 170, 0, 0.12)'
      : 'rgba(0, 214, 143, 0.12)'};
  color: ${props => props.expired
    ? '#ff3d71'
    : props.expiringSoon
      ? '#ffaa00'
      : '#00d68f'};
`;

const ListExpirationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
  background: ${props => props.expired
    ? 'rgba(255, 61, 113, 0.12)'
    : props.expiringSoon
      ? 'rgba(255, 170, 0, 0.12)'
      : 'rgba(0, 214, 143, 0.12)'};
  color: ${props => props.expired
    ? '#ff3d71'
    : props.expiringSoon
      ? '#ffaa00'
      : '#00d68f'};
`;

const ListCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: ${props => props.theme.backgroundBasicColor1};
  border: 1px solid ${props => props.theme.borderBasicColor3};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${props => props.theme.backgroundBasicColor2};
    border-color: ${props => props.theme.colorPrimary400};
    transform: translateX(4px);
  }
`;

const ListIconWrapper = styled.div`
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isFolder
    ? `linear-gradient(135deg, rgba(255, 170, 0, 0.1) 0%, rgba(255, 170, 0, 0.05) 100%)`
    : props.iconBg || `linear-gradient(135deg, rgba(51, 102, 255, 0.1) 0%, rgba(51, 102, 255, 0.05) 100%)`};
`;

const ListContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ListTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.theme.colorBasic800};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ListMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.75rem;
  color: ${props => props.theme.colorBasic600};
`;

const ListActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${ListCard}:hover & {
    opacity: 1;
  }
`;

const AssetItemCard = ({
  item,
  type,
  onOpen,
  onEdit,
  onDelete,
  viewMode = 'grid'
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuButtonRef = useRef(null);
  const intl = useIntl();

  const isFolder = type === 'folder';
  const hasPermission = item.canEdit !== undefined ? item.canEdit : true;

  // Verificar expiração do documento
  const expirationInfo = useMemo(() => {
    if (isFolder || !item.expirationDate) return null;

    const expirationDate = new Date(item.expirationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isExpired = diffDays < 0;
    const isExpiringSoon = !isExpired && diffDays <= 30;

    const formatDate = (date) => {
      return date.toLocaleDateString(intl.locale || 'pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    return {
      isExpired,
      isExpiringSoon,
      daysUntilExpiration: diffDays,
      formattedDate: formatDate(expirationDate)
    };
  }, [item.expirationDate, isFolder, intl.locale]);

  // Determinar tipo de arquivo baseado na extensão
  const getFileInfo = (fileName) => {
    if (!fileName) return { icon: 'file-text-outline', status: 'Primary', ext: '', bg: '', color: '', iconBg: '' };

    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    const fileTypes = {
      // Documentos
      pdf: { icon: 'file-text-outline', status: 'Danger', ext: 'PDF', bg: 'rgba(255, 61, 113, 0.15)', color: '#ff3d71', iconBg: 'linear-gradient(135deg, rgba(255, 61, 113, 0.12) 0%, rgba(255, 61, 113, 0.05) 100%)' },
      doc: { icon: 'file-text-outline', status: 'Primary', ext: 'DOC', bg: 'rgba(51, 102, 255, 0.15)', color: '#3366ff', iconBg: 'linear-gradient(135deg, rgba(51, 102, 255, 0.12) 0%, rgba(51, 102, 255, 0.05) 100%)' },
      docx: { icon: 'file-text-outline', status: 'Primary', ext: 'DOCX', bg: 'rgba(51, 102, 255, 0.15)', color: '#3366ff', iconBg: 'linear-gradient(135deg, rgba(51, 102, 255, 0.12) 0%, rgba(51, 102, 255, 0.05) 100%)' },
      xls: { icon: 'grid-outline', status: 'Success', ext: 'XLS', bg: 'rgba(0, 214, 143, 0.15)', color: '#00d68f', iconBg: 'linear-gradient(135deg, rgba(0, 214, 143, 0.12) 0%, rgba(0, 214, 143, 0.05) 100%)' },
      xlsx: { icon: 'grid-outline', status: 'Success', ext: 'XLSX', bg: 'rgba(0, 214, 143, 0.15)', color: '#00d68f', iconBg: 'linear-gradient(135deg, rgba(0, 214, 143, 0.12) 0%, rgba(0, 214, 143, 0.05) 100%)' },
      ppt: { icon: 'monitor-outline', status: 'Warning', ext: 'PPT', bg: 'rgba(255, 170, 0, 0.15)', color: '#ffaa00', iconBg: 'linear-gradient(135deg, rgba(255, 170, 0, 0.12) 0%, rgba(255, 170, 0, 0.05) 100%)' },
      pptx: { icon: 'monitor-outline', status: 'Warning', ext: 'PPTX', bg: 'rgba(255, 170, 0, 0.15)', color: '#ffaa00', iconBg: 'linear-gradient(135deg, rgba(255, 170, 0, 0.12) 0%, rgba(255, 170, 0, 0.05) 100%)' },
      txt: { icon: 'file-text-outline', status: 'Basic', ext: 'TXT', bg: 'rgba(143, 155, 179, 0.15)', color: '#8f9bb3', iconBg: 'linear-gradient(135deg, rgba(143, 155, 179, 0.12) 0%, rgba(143, 155, 179, 0.05) 100%)' },
      // Imagens
      jpg: { icon: 'image-outline', status: 'Info', ext: 'JPG', bg: 'rgba(0, 149, 255, 0.15)', color: '#0095ff', iconBg: 'linear-gradient(135deg, rgba(0, 149, 255, 0.12) 0%, rgba(0, 149, 255, 0.05) 100%)' },
      jpeg: { icon: 'image-outline', status: 'Info', ext: 'JPEG', bg: 'rgba(0, 149, 255, 0.15)', color: '#0095ff', iconBg: 'linear-gradient(135deg, rgba(0, 149, 255, 0.12) 0%, rgba(0, 149, 255, 0.05) 100%)' },
      png: { icon: 'image-outline', status: 'Info', ext: 'PNG', bg: 'rgba(0, 149, 255, 0.15)', color: '#0095ff', iconBg: 'linear-gradient(135deg, rgba(0, 149, 255, 0.12) 0%, rgba(0, 149, 255, 0.05) 100%)' },
      gif: { icon: 'image-outline', status: 'Info', ext: 'GIF', bg: 'rgba(0, 149, 255, 0.15)', color: '#0095ff', iconBg: 'linear-gradient(135deg, rgba(0, 149, 255, 0.12) 0%, rgba(0, 149, 255, 0.05) 100%)' },
      svg: { icon: 'image-outline', status: 'Info', ext: 'SVG', bg: 'rgba(0, 149, 255, 0.15)', color: '#0095ff', iconBg: 'linear-gradient(135deg, rgba(0, 149, 255, 0.12) 0%, rgba(0, 149, 255, 0.05) 100%)' },
      // Compactados
      zip: { icon: 'archive-outline', status: 'Warning', ext: 'ZIP', bg: 'rgba(255, 170, 0, 0.15)', color: '#ffaa00', iconBg: 'linear-gradient(135deg, rgba(255, 170, 0, 0.12) 0%, rgba(255, 170, 0, 0.05) 100%)' },
      rar: { icon: 'archive-outline', status: 'Warning', ext: 'RAR', bg: 'rgba(255, 170, 0, 0.15)', color: '#ffaa00', iconBg: 'linear-gradient(135deg, rgba(255, 170, 0, 0.12) 0%, rgba(255, 170, 0, 0.05) 100%)' },
      '7z': { icon: 'archive-outline', status: 'Warning', ext: '7Z', bg: 'rgba(255, 170, 0, 0.15)', color: '#ffaa00', iconBg: 'linear-gradient(135deg, rgba(255, 170, 0, 0.12) 0%, rgba(255, 170, 0, 0.05) 100%)' },
      // Vídeos
      mp4: { icon: 'film-outline', status: 'Danger', ext: 'MP4', bg: 'rgba(255, 61, 113, 0.15)', color: '#ff3d71', iconBg: 'linear-gradient(135deg, rgba(255, 61, 113, 0.12) 0%, rgba(255, 61, 113, 0.05) 100%)' },
      avi: { icon: 'film-outline', status: 'Danger', ext: 'AVI', bg: 'rgba(255, 61, 113, 0.15)', color: '#ff3d71', iconBg: 'linear-gradient(135deg, rgba(255, 61, 113, 0.12) 0%, rgba(255, 61, 113, 0.05) 100%)' },
      mov: { icon: 'film-outline', status: 'Danger', ext: 'MOV', bg: 'rgba(255, 61, 113, 0.15)', color: '#ff3d71', iconBg: 'linear-gradient(135deg, rgba(255, 61, 113, 0.12) 0%, rgba(255, 61, 113, 0.05) 100%)' },
      // Código
      json: { icon: 'code-outline', status: 'Warning', ext: 'JSON', bg: 'rgba(255, 170, 0, 0.15)', color: '#ffaa00', iconBg: 'linear-gradient(135deg, rgba(255, 170, 0, 0.12) 0%, rgba(255, 170, 0, 0.05) 100%)' },
      xml: { icon: 'code-outline', status: 'Warning', ext: 'XML', bg: 'rgba(255, 170, 0, 0.15)', color: '#ffaa00', iconBg: 'linear-gradient(135deg, rgba(255, 170, 0, 0.12) 0%, rgba(255, 170, 0, 0.05) 100%)' },
      csv: { icon: 'grid-outline', status: 'Success', ext: 'CSV', bg: 'rgba(0, 214, 143, 0.15)', color: '#00d68f', iconBg: 'linear-gradient(135deg, rgba(0, 214, 143, 0.12) 0%, rgba(0, 214, 143, 0.05) 100%)' },
    };

    return fileTypes[ext] || {
      icon: 'file-outline',
      status: 'Primary',
      ext: ext.toUpperCase() || 'FILE',
      bg: 'rgba(130, 87, 229, 0.15)',
      color: '#8257e5',
      iconBg: 'linear-gradient(135deg, rgba(130, 87, 229, 0.12) 0%, rgba(130, 87, 229, 0.05) 100%)'
    };
  };

  const getVisibilityLabel = (visibility) => {
    switch (visibility) {
      case "public": return { icon: "globe-outline", label: "Público" };
      case "private": return { icon: "lock-outline", label: "Privado" };
      case "limited": return { icon: "people-outline", label: "Limitado" };
      default: return null;
    }
  };

  const handleOpenDocument = async () => {
    if (isLoadingUrl || isFolder) return;

    setIsLoadingUrl(true);
    try {
      const response = await Fetch.get(`/assetdocument/presigned?id=${item.id}`);
      if (response.data && response.data.presignedUrl) {
        window.open(response.data.presignedUrl, "_blank");
      }
    } catch (error) {
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const fileInfo = !isFolder ? getFileInfo(item.fileName) : null;
  const visibilityInfo = isFolder ? getVisibilityLabel(item.visibility) : null;

  const handleClick = () => {
    if (isFolder) {
      onOpen && onOpen(item);
    } else {
      handleOpenDocument();
    }
  };

  // Renderização em modo lista
  if (viewMode === 'list') {
    return (
      <React.Fragment>
        {(showMenu || showDeleteConfirm) && (
          <Backdrop onClick={() => {
            setShowMenu(false);
            setShowDeleteConfirm(false);
          }} />
        )}
        <ListCard onClick={handleClick} style={{ opacity: isLoadingUrl ? 0.7 : 1 }}>
          <ListIconWrapper isFolder={isFolder} iconBg={fileInfo?.iconBg}>
            <EvaIcon
              status={isFolder ? "Warning" : fileInfo?.status || "Primary"}
              name={isFolder ? "folder" : fileInfo?.icon || "file-outline"}
              style={{ fontSize: '22px' }}
            />
          </ListIconWrapper>

          <ListContent>
            <ListTitle>{isFolder ? item.name : (item.title || item.fileName)}</ListTitle>
            <ListMeta>
              {isFolder ? (
                <>
                  {visibilityInfo && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <EvaIcon name={visibilityInfo.icon} style={{ fontSize: "12px" }} />
                      {visibilityInfo.label}
                    </span>
                  )}
                  {item.itemCount !== undefined && (
                    <span>{item.itemCount} <FormattedMessage id={item.itemCount === 1 ? "item" : "items"} /></span>
                  )}
                </>
              ) : (
                <>
                  {fileInfo?.ext && (
                    <FileExtension bg={fileInfo.bg} color={fileInfo.color}>
                      {fileInfo.ext}
                    </FileExtension>
                  )}
                  <span>{formatterMbKb(item.fileSize)}</span>
                  {item.types && item.types.length > 0 && (
                    <span>{item.types.slice(0, 2).join(', ')}{item.types.length > 2 ? ` +${item.types.length - 2}` : ''}</span>
                  )}
                  {expirationInfo && (
                    <ListExpirationBadge
                      expired={expirationInfo.isExpired}
                      expiringSoon={expirationInfo.isExpiringSoon}
                    >
                      <EvaIcon
                        name={expirationInfo.isExpired ? "alert-circle-outline" : "calendar-outline"}
                        style={{ fontSize: "12px" }}
                      />
                      {expirationInfo.isExpired ? (
                        <FormattedMessage id="expired" />
                      ) : (
                        expirationInfo.formattedDate
                      )}
                    </ListExpirationBadge>
                  )}
                </>
              )}
            </ListMeta>
          </ListContent>

          {hasPermission && (
            <ListActions>
              <Button
                size="Tiny"
                status="Basic"
                appearance="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              >
                <EvaIcon name="edit-outline" style={{ fontSize: "16px" }} />
              </Button>
              <Button
                ref={menuButtonRef}
                size="Tiny"
                status="Danger"
                appearance="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
              >
                <EvaIcon name="trash-2-outline" style={{ fontSize: "16px" }} />
              </Button>
            </ListActions>
          )}

          {showDeleteConfirm && (
            <DeleteConfirmationPopover
              item={item}
              type={type}
              buttonRef={menuButtonRef}
              onConfirm={() => {
                setShowDeleteConfirm(false);
                onDelete(item);
              }}
              onCancel={() => {
                setShowDeleteConfirm(false);
              }}
            />
          )}
        </ListCard>
      </React.Fragment>
    );
  }

  // Renderização em modo grid (padrão)
  return (
    <React.Fragment>
      {(showMenu || showDeleteConfirm) && (
        <Backdrop onClick={() => {
          setShowMenu(false);
          setShowDeleteConfirm(false);
        }} />
      )}
      <StyledCard isFolder={isFolder}>
        {/* Botão de menu no canto superior direito */}
        {hasPermission && (
          <CardHeader style={{ paddingTop: "0.5rem", paddingBottom: "0", paddingRight: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                ref={menuButtonRef}
                size="Tiny"
                status="Basic"
                appearance="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                style={{ opacity: 0.6, transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
              >
                <EvaIcon name="more-vertical-outline" style={{ fontSize: "18px" }} />
              </Button>
            </div>
            {showMenu && !showDeleteConfirm && (
              <DropdownMenu>
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit(item);
                  }}
                >
                  <EvaIcon name="edit-outline" status="Info" style={{ fontSize: "16px" }} />
                  <TextSpan apparence="c2">
                    <FormattedMessage id="edit" />
                  </TextSpan>
                </MenuItem>
                <MenuItem
                  className="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                >
                  <EvaIcon name="trash-2-outline" status="Danger" style={{ fontSize: "16px" }} />
                  <TextSpan apparence="c2" status="Danger">
                    <FormattedMessage id="delete" />
                  </TextSpan>
                </MenuItem>
              </DropdownMenu>
            )}

            {showDeleteConfirm && (
              <DeleteConfirmationPopover
                item={item}
                type={type}
                buttonRef={menuButtonRef}
                onConfirm={() => {
                  setShowDeleteConfirm(false);
                  setShowMenu(false);
                  onDelete(item);
                }}
                onCancel={() => {
                  setShowDeleteConfirm(false);
                }}
              />
            )}
          </CardHeader>
        )}

        {/* Badge de visibilidade para pastas */}
        {isFolder && visibilityInfo && (
          <PermissionBadge visibility={item.visibility}>
            <EvaIcon name={visibilityInfo.icon} style={{ fontSize: "12px" }} />
            {visibilityInfo.label}
          </PermissionBadge>
        )}

        <CardBody onClick={handleClick} style={{ padding: "0.75rem", paddingTop: hasPermission ? "0" : "0.75rem" }}>
          <ColFlex>
            {/* Ícone com wrapper colorido */}
            <IconWrapper isFolder={isFolder} iconBg={fileInfo?.iconBg}>
              <ItemIcon
                status={isFolder ? "Warning" : fileInfo?.status || "Primary"}
                name={isFolder ? "folder" : fileInfo?.icon || "file-outline"}
              />
            </IconWrapper>

            {isFolder ? (
              <>
                <FileName>{item.name}</FileName>

                {item.description && (
                  <Description>{item.description}</Description>
                )}

                {item.itemCount !== undefined && (
                  <ItemCount>
                    <EvaIcon name="layers-outline" style={{ fontSize: "14px" }} />
                    {item.itemCount} <FormattedMessage id={item.itemCount === 1 ? "item" : "items"} />
                  </ItemCount>
                )}
              </>
            ) : (
              <>
                <FileName style={{ opacity: isLoadingUrl ? 0.6 : 1 }}>
                  {item.title || item.fileName}
                </FileName>

                <FileInfo>
                  {fileInfo?.ext && (
                    <FileExtension bg={fileInfo.bg} color={fileInfo.color}>
                      {fileInfo.ext}
                    </FileExtension>
                  )}
                  <span>{formatterMbKb(item.fileSize)}</span>
                </FileInfo>

                {item.description && (
                  <Description>{item.description}</Description>
                )}

                {item.types && item.types.length > 0 && (
                  <TagsContainer>
                    {item.types.slice(0, 3).map((tagType, index) => (
                      <Tag key={index}>{tagType}</Tag>
                    ))}
                    {item.types.length > 3 && (
                      <Tag>+{item.types.length - 3}</Tag>
                    )}
                  </TagsContainer>
                )}

                {expirationInfo && (
                  <ExpirationBadge
                    expired={expirationInfo.isExpired}
                    expiringSoon={expirationInfo.isExpiringSoon}
                  >
                    <EvaIcon
                      name={expirationInfo.isExpired ? "alert-circle-outline" : "calendar-outline"}
                      style={{ fontSize: "14px" }}
                    />
                    {expirationInfo.isExpired ? (
                      <FormattedMessage id="expired" />
                    ) : expirationInfo.isExpiringSoon ? (
                      <FormattedMessage
                        id="expires.in.days"
                        values={{ days: expirationInfo.daysUntilExpiration }}
                      />
                    ) : (
                      expirationInfo.formattedDate
                    )}
                  </ExpirationBadge>
                )}
              </>
            )}
          </ColFlex>
        </CardBody>
      </StyledCard>
    </React.Fragment>
  );
};

export default AssetItemCard;

