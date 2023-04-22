import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ProductTable } from "src/sections/product/product-table";
import { getElements, putElements } from "src/service/api";
import { postElements } from "src/service/api";
import ProductModal from "src/sections/product/modal-product";
import { PRODUCTS } from "../service/endpoints";
import { FILTER } from "../service/endpoints";
import { showAlert } from "src/sections/global/alert";
import { useAuthContext } from "src/contexts/auth-context";
import { Search } from "src/sections/global/search";
import { ButtonCustom } from "src/sections/global/ButtonCustom";
import ModalAddQuantity from "src/sections/product/modal-add-quantity";

const Page = () => {
  const { user } = useAuthContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [isShow, setIsShow] = useState(0);
  const [data, setData] = useState({
    prId: "",
    prName: "",
    prDescription: "",
    prPrices: "",
    prQuantity: "",
    prStockSecurity: "",
    productBrandByPrBrandId: "",
    brand: "",
    productCategoryByPrCategoryId: "",
    category: "",
    prBarCode: "",
    prAvgCost: "",
    isNew: true,
  });
  const [count, setCount] = useState(0);
  const [edit, setEdit] = useState("New");

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    getData(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    localStorage.setItem("rowsPerPage", `${event.target.value}`);
    getData(page);
  }, []);

  const getData = async (pageRow = 0) => {
    let size = localStorage.getItem("rowsPerPage");
    var response = await getElements(`${PRODUCTS.list}?page=${pageRow}&size=${size}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    setRows(response.response.body.value);
    setCount(response.response.body.totalItems);
    setRowsPerPage(Number(size));
  };

  const filter = async (value) => {
    setIsShow(1);
    if (value == "") {
      getData(page);
      setIsShow(0);
      return;
    }
    var response = await getElements(`${FILTER.list}?search=${value}&location=${"products"}`, {
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setIsShow(0);
      return;
    }
    setRows(response.response.body);
    setCount(response.response.body.length);
    setIsShow(0);
  };
  const openModal = (obj, isEdit) => {
    setOpen(true);
    if (isEdit) {
      setEdit("Edit");
      setData((item) => ({
        ...item,
        ...{
          prId: obj.prId,
          prName: obj.prName,
          prDescription: obj.prDescription,
          prPrices: obj.prPrices,
          prQuantity: obj.prQuantity,
          prStockSecurity: obj.prStockSecurity,
          productBrandByPrBrandId: obj.productBrandByPrBrandId.prBrId,
          brand: {
            value: obj.productBrandByPrBrandId.prBrId,
            label: obj.productBrandByPrBrandId.prBrName,
          },
          productCategoryByPrCategoryId: obj.productCategoryByPrCategoryId.prcId,
          category: {
            value: obj.productCategoryByPrCategoryId.prcId,
            label: obj.productCategoryByPrCategoryId.prcName,
          },
          prBarCode: obj.prBarCode,
          prAvgCost: obj.prAvgCost,
          isNew: false,
        },
      }));
      return;
    }
    setEdit("New");
    setData((item) => ({
      ...item,
      ...{
        prId: "",
        prName: "",
        prDescription: "",
        prPrices: "",
        prQuantity: "",
        prStockSecurity: "",
        productBrandByPrBrandId: "",
        brand: "",
        productCategoryByPrCategoryId: "",
        category: "",
        prBarCode: "",
        prAvgCost: "",
        isNew: true,
      },
    }));
  };

  const SendData = (obj) => {
    if (obj.isNew) {
      create(obj);
      return;
    } else {
      update(obj);
      return;
    }
  };

  const create = async (obj) => {
    var response = await postElements(
      `${PRODUCTS.create}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        barCode: obj.prBarCode,
        name: obj.prName,
        description: obj.prDescription,
        categoryId: obj.productCategoryByPrCategoryId,
        brandId: obj.productBrandByPrBrandId,
        price: obj.prPrices,
        cost: obj.prAvgCost,
        quantity: obj.prQuantity,
        stockSecurity: obj.prStockSecurity,
      }
    );
    if (response.status != 201) {
      setOpen(false);
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
    getData(page);
    setOpen(false);
    showAlert("Success", "success", "Success");
  };

  const update = async (obj) => {
    var response = await putElements(
      `${PRODUCTS.update.replace("{id}", obj.prId)}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        name: obj.prName,
        description: obj.prDescription,
        prices: obj.prPrices,
        brandId: obj.productBrandByPrBrandId,
        categoryId: obj.productCategoryByPrCategoryId,
      }
    );
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setOpen(false);
      return;
    }
    getData(page);
    setOpen(false);
    showAlert("Success", "success", "Success");
  };

  const AddQuantity = async (obj) => {
    var response = await postElements(
      `${PRODUCTS.addQuantity.replace("{id}", obj.prId)}`,
      {
        "Content-Type": "application/json",
        jwt: `${user.id}`,
      },
      {
        cost: 0,
        price: 0,
        quantity: obj.prQuantity,
      }
    );
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      setOpenAdd(false);
      return;
    }
    getData(page);
    setOpenAdd(false);
    showAlert("Success", "success", "Success");
  };

  const changeStatus = async (obj) => {
    var response = await getElements(`${EMPLOYEES.changeStatus.replace("{id}", obj.empUuid)}`, {
      "Content-Type": "application/json",
      jwt: `${user.id}`,
    });
    if (response.status != 200) {
      showAlert(response.response.status.description, "error", "Error");
      return;
    }
  };

  useEffect(() => {
    localStorage.setItem("rowsPerPage", "5");
    getData(page);
  }, []);

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Products</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <ButtonCustom
                  openModal={() => {
                    openModal({}, false);
                  }}
                />
                <ProductModal
                  data={data}
                  title={"New"}
                  open={open}
                  edit={edit}
                  OnClose={() => {
                    setOpen(false);
                  }}
                  OnSend={(res) => {
                    SendData(res);
                  }}
                />
                <ModalAddQuantity
                  data={data}
                  open={openAdd}
                  OnSend={(res) => {
                    AddQuantity(res);
                  }}
                  OnClose={() => {
                    setOpenAdd(false);
                  }}
                />
              </div>
            </Stack>

            <Search
              OnSearch={(res) => {
                filter(res);
              }}
              isShow={isShow}
              refresh={() => {
                getData(page);
              }}
            />

            <ProductTable
              isSecondary={0}
              count={count}
              items={rows}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              OnEdit={(res) => {
                openModal(res, true);
              }}
              OnChangeStatus={(res) => {
                changeStatus(res);
              }}
              AddQuantity={(res) => {
                setData((item) => ({
                  ...item,
                  ...{
                    prId: res.prId,
                  },
                }));
                setOpenAdd(true);
              }}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
